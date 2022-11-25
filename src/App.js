import './App.css';
import React, {useState, useEffect} from 'react';
import SearchArea from './Containers/SearchArea';
import DisplayArea from './Containers/DisplayArea';
import factionList from './Assets/factionList';

function App() {
  const [compiledData, setCompiledData] = useState({});
  const [allCardNames, setAllCardNames] = useState([]);
  const [displayCardNames, setDisplayCardNames] = useState([]);
  const [searchField, setSearchField] = useState('');
  const [factionFilter, setFactionFilter] = useState({});
  const [isRegex, setIsRegex] = useState(false);
  const [invalidRegex, setInvalidRegex] = useState(false);

  useEffect(() => {
    async function fetchCardData() {
      let cardData = await (await fetch('https://calebgannon.com/wp-content/uploads/algomancy-extras/AlgomancyCards.json')).json();
      setCompiledData(cardData);
    }

    fetchCardData();
  },[] )

  useEffect(() => { //set state default values onMount
    //set default array with all the card names
    let arrayedNames = [];
    for (let data in compiledData) {
        let cardName = data
        
      arrayedNames.push(cardName);

    }
    setAllCardNames(arrayedNames);

    //set faction filter to default as true
    let defaultFactionFilter = {};
    factionList.forEach((faction) => {
      let factionName = faction[0];
      defaultFactionFilter[`${factionName}`] = true;
    })

    setFactionFilter(defaultFactionFilter);
  },[compiledData])

  useEffect(() => {
    let displayedFactions = [];
    for (let faction in factionFilter) {
      if(factionFilter[faction]) {
        displayedFactions.push(faction);
      }
    }

    //check if the search input starts with / and contains a non escaped / to see if it's a regex
    let searchFieldWords = searchField.split(' ');
    let regexCheck = /(^\/).*([^\\]\/g?i?m?)$/g;
    setIsRegex(regexCheck.test(searchField));

    let containsModifiers = false, splitSearch = [], searchRegex = '', modifiers = '', regex = '';
    let filteredCardNames = [];
    if(isRegex) {
      containsModifiers = searchField.at(-1) === '/'? false : true;
      //remove empty spaces caused by / removal
      splitSearch = searchField.split('/').filter(item => item !== '');

        if (!containsModifiers) {
          searchRegex = splitSearch.join('/');
        } else if (containsModifiers) {
          //if there are modifiers, pop them out and remove non-modifier characters, then sort modifiers alphabetically
          modifiers = splitSearch.pop().replace(/[^gim]/g,'');
          searchRegex = splitSearch.join('/');
        }

        try {
          regex = new RegExp(searchRegex, modifiers);
          setInvalidRegex(false);
        } catch (error) {
          console.error(error);
          setInvalidRegex(true);
        }
    }
    
    if(!invalidRegex) {
      filteredCardNames = allCardNames.filter(cardName =>{
        let includeCard = false;
        let containsSearch = false;
        let cardInfo = compiledData[cardName][0];
        let cardText = cardInfo.text;
        let cardType = cardInfo.type;
        let compiledString = cardName.concat(' ', cardText, ' ', cardType);
        let cardFactions = cardInfo.factions;
        let filteredFactions = []
        for (let faction in factionFilter) {
          if (factionFilter[faction]) {
            filteredFactions.push(faction);
          }
        }

        let factionTrue = filteredFactions.some(faction => cardFactions.includes(faction));

        if(!isRegex) {
          for(let i = 0; i < searchFieldWords.length; i++) {
            let doesContain = compiledString.toLowerCase().includes(searchFieldWords[i]);
            if (!doesContain) break;
            if (i === searchFieldWords.length -1) containsSearch = true;
          }

        } else if (isRegex) {
  
          try {
            containsSearch = regex.test(compiledString);
          } catch (error) {
            console.error(error);
          }
        }

        if(containsSearch && factionTrue) {
          includeCard = true;
        }

        return includeCard;
      })
    }
    setDisplayCardNames(filteredCardNames);

  }, [searchField, factionFilter])

  const onSearchChange = (e) => {
    setSearchField(e.target.value);
  }

  return (
    <div className="App">
      <SearchArea 
        factionList={factionList} setFactionFilter={setFactionFilter} factionFilter={factionFilter} 
        isRegex={isRegex} onSearchChange={onSearchChange}
      />
      {!invalidRegex ? 
        <DisplayArea displayCardNames={displayCardNames} compiledData={compiledData}/> : 
        <div id='invalRegexMessage'>
          <h3>Sorry, that's not a valid Regex Expression.</h3>
        </div>}
    </div>
  );
}

export default App;
