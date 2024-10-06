
/**
 * @description generate the graphic component for item rendering
 * @param {*} width 
 * @param {*} height 
 * @param {*} retailValue 
 * @param {*} WSNValue 
 * @param {*} info 
 * @returns 
 */
MATTIE.iteminfoGraphics = function(x,y,width, height, retailValue, WSNValue, title, info, ID ,retailValueHeader='Retail Value',wsnValueHeader='WSN Value'){
    const block = MATTIE.graphics.rectWithOnlyTopRounded(7,7,width-14, 50, 15, 0x140f99, 1);
    const text = new PIXI.Text(ID, MATTIE.yellowHeaderStyle);
    const container = new Sprite(new Bitmap(width, height))

    text.y = 20;
    text.x = 26;
    block.addChild(text);
    container.addChild(MATTIE.graphics.roundedRect(0,0,width,height,20,0xffffff,.5, 4, 0x0606c2, .7))
    container.addChild(block);
    
    container.x = 18+x;;
    container.y = 18+y;;



    let addWrap = (style) =>{
        return({...style,
            wordWrap:true,
            wordWrapWidth: width-10
        })
    }
    const retailPriceHeader = new PIXI.Text(retailValueHeader, addWrap(MATTIE.headerStyle));
    const WSNPriceHeader = new PIXI.Text(wsnValueHeader, addWrap(MATTIE.headerStyle));
    const retailPrice = new PIXI.Text(retailValue, addWrap(MATTIE.priceStyle));
    const WSNPrice = new PIXI.Text(WSNValue, addWrap(MATTIE.priceStyle));
    const Title = new PIXI.Text(title, addWrap(MATTIE.headerStyle));
    const infoObj = new PIXI.Text(info, addWrap(MATTIE.textStyle));

    // Set the position of the text
    Title.x = 20;
    Title.y = block.height+5;
    
    infoObj.x = 20;
    infoObj.y = block.height+5+Title.height;

    retailPriceHeader.x = 20;
    retailPriceHeader.y = block.height+5+Title.height+infoObj.height;

    retailPrice.x = 17;
    retailPrice.y = block.height+5+Title.height+infoObj.height+retailPriceHeader.height;

    WSNPriceHeader.x = 20;
    WSNPriceHeader.y =  block.height+5+Title.height+infoObj.height+retailPriceHeader.height+retailPrice.height;

    WSNPrice.x = 20;
    WSNPrice.y =  block.height+5+Title.height+infoObj.height+retailPriceHeader.height+retailPrice.height+WSNPriceHeader.height;
    
    
  
  
    container.addChild(retailPriceHeader)
    container.addChild(WSNPriceHeader)
    container.addChild(retailPrice)
    container.addChild(WSNPrice)
    container.addChild(Title)
    container.addChild(infoObj)
    return container
}


async function spawnScull(){
    const eventId = MATTIE.static.hats.scaryScull.id;
    const mapId = MATTIE.static.prefabWorldId;
    const scull = await spawnEvent(eventId, mapId, $gamePlayer.x+MATTIE.util.randBetween(-4,4), $gamePlayer.y+MATTIE.util.randBetween(-4,4), "<mv3d:shape(sprite),alphatest(1),height(-0.1),scale(1.1),pass(*)>")
    setTimeout(() => {
        scull.delete();
    }, 5000);
}
//scull spawner
function spawnEvent(evId,mapId,x=$gamePlayer.x,y=$gamePlayer.y,note=MATTIE.visualEquip.note){
    return new Promise(res=>{
        const eventId = evId;
        MATTIE.eventAPI.getEventOnMap(eventId, mapId).then(ev=>{
            let scull= new MapEvent().copyActionsFromEventOnMap(eventId, mapId);
            scull = Object.assign(scull, ev);
            scull.setPersist(false);
            scull.data.x=x
            scull.data.y=y
            scull._x=x
            scull._y=y
            scull._characterName = "items"
            scull.data.note=note||scull.data.note;
            //hat2.data.note="<mv3d:shape(sprite),alphatest(1),height(-0.1),zoff(-.2),doff(.7),scale(1.1),pass(*),DirFix(1)>";
            scull.spawn(x,y)

            scull.atPlayerPos=true;
            scull.allMaps=true;


            scull.delete = function(){
                const ev = $gameMap.event( scull.data.id);
                if(ev){
                    ev.locate(0,0);
                    ev.update();
                    ev.refresh();
                }
                scull.removeThisEvent();
            }

            setTimeout(() => {
                let ev =$gameMap.event( scull.data.id);
                if(ev)MATTIE.visualEquip.objsQuedForDisposal[scull.data.id] = ev.mv3d_sprite;
            }, 500);    

            res(scull);
        }) 
    })
    
}


