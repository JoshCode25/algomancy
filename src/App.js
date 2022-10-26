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
      if(cardName === 'Bonk'){
        console.log(compiledData[cardName]);
      }

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

    const filteredCardNames = allCardNames.filter(cardName =>{
      let testBoolean = false;
      let cardInfo = compiledData[cardName][0];
      let cardText = cardInfo.text;
      let cardType = cardInfo.type;
      let cardFactions = cardInfo.factions;
      let filteredFactions = []
      for (let faction in factionFilter) {
        if (factionFilter[faction]) {
          filteredFactions.push(faction);
        }
      }

      let containsName = cardName.toLowerCase().includes(searchField.toLowerCase());
      let containsText = cardText.toLowerCase().includes(searchField.toLowerCase());
      let containsType = cardType.toLowerCase().includes(searchField.toLowerCase());
      let factionTrue = filteredFactions.some(faction => cardFactions.includes(faction));

      if((containsName || containsText || containsType) && factionTrue) {
        testBoolean = true;
      }

      return testBoolean;
    })

    setDisplayCardNames(filteredCardNames);

  }, [searchField, factionFilter])

  const onSearchChange = (e) => {
    setSearchField(e.target.value);
    console.log(searchField);
  }

  return (
    <div className="App">
      <SearchArea 
        factionList={factionList} setFactionFilter={setFactionFilter} factionFilter={factionFilter} onSearchChange={onSearchChange}
      />
      <DisplayArea displayCardNames={displayCardNames} compiledData={compiledData}/>
    </div>
  );
}

export default App;
