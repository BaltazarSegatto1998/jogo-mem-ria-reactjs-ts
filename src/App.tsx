import {useEffect, useState} from 'react'
import * as C from './App.styled'
import logoImage from './assets/devmemory_logo.png'
import {InfoItem} from './components/infoItem'
import { Button } from './components/infoItem/Button'
import  {GridItem} from './components/GridItem'
import RestarIcon from './svgs/restart.svg'
import { GridItemType } from './types/GridItemType'

import {items} from './data/items'
import { FormatTimerElapsed } from './helpers/formatTimerElapsed'

export const App = () => {
  const [playing,setPlaying] = useState<boolean>(false);
  const [timerElapsed, setTimerElapsed] = useState<number>(0);
  const [moveCount, setMovecount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, SetGridItems] = useState<GridItemType[]>([]);


  useEffect(() => {
    resetAndCreateGrid()
  }, [])


  useEffect(() => {
    const timer = setInterval(() => {
      if(playing) {
        setTimerElapsed(timerElapsed + 1)
      } 
    },1000);
    return () => clearInterval(timer)
  }, [playing, timerElapsed])


  useEffect(() => {
      if(shownCount === 2) {
       
        let opened = gridItems.filter(item => item.shown === true);
        if(opened.length === 2) {

          if(opened[0].item === opened[1].item) {
            let tmpGrid = [...gridItems];
            for(let i in tmpGrid){
              
              if(tmpGrid[i].shown){
                tmpGrid[i].permanentShown = true;
                tmpGrid[i].shown = false;
              }
            }
            SetGridItems(tmpGrid);
            setShownCount(0)
          } else {
            setTimeout(() => {
              let tmpGrid = [...gridItems];
            for (let i in tmpGrid) {
              tmpGrid[i].shown = false
            }
            SetGridItems(tmpGrid);
            setShownCount(0)
            },1000)
          }

        

          setMovecount(moveCount => moveCount + 1);
        }
      }
  }, [shownCount,gridItems])


  useEffect(() => {
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItems])


   const resetAndCreateGrid = () => {
    setTimerElapsed(0);
    setMovecount(0);
    setShownCount(0);

    let tmpGrid:GridItemType[] = [];
    for(let i = 0; i < (items.length * 2); i ++) {
        tmpGrid.push({
          item:null,
          shown:false,
          permanentShown:false
        });
    }

    for (let w = 0; w < 2; w++) {
      for(let i = 0; i < items.length; i++) {
        let pos = -1;
        while( pos < 0 || tmpGrid[pos].item !== null) {
         pos = Math.floor(Math.random() * (items.length * 2));
        }
          tmpGrid[pos].item = i;
      }
    }



    SetGridItems(tmpGrid)
   

    setPlaying(true);
    


  }

  const handleItemClick = (index:number) => {
    if(playing && index !== null && shownCount < 2) {
      let tmpGrid = [...gridItems];

      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false ) {
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1 )
      }

      SetGridItems(tmpGrid);
    }
  }

  return (
   <C.Container>

    <C.Info>
        <C.LogoLink href="">
              <img src={logoImage} width={200} alt="" />
        </C.LogoLink>

        <C.InfoArea>
        
          <InfoItem label="Tempo" value={FormatTimerElapsed(timerElapsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
        </C.InfoArea>

      <Button icon={RestarIcon} label="Reiniciar" onClick={resetAndCreateGrid}/>


    </C.Info>

    <C.GridArea>
      <C.Grid>
   
         {gridItems.map((item,index) => (
          <GridItem key={index}
            item={item}
            onClick={() => handleItemClick(index)}
          />
        ))}
      </C.Grid>
    </C.GridArea>
  </C.Container>
  )
}


export default App;