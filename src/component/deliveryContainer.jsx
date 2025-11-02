export default function DeliveryContainer({deli,  onUpdate}){
    return (
        <div style={{display:'flex',gap:'0.5em',width:'100%'}}>
            <input type="text" value={deli.name} style={{flex:'1'}} onChange={(e)=>onUpdate({id:deli.id,name:e.target.value,link:deli.link})}/>
            <input type="text" value={deli.link} style={{flex:'4'}} onChange={(e)=>onUpdate({id:deli.id,name:deli.name,link:e.target.value})}/>
        </div>
    )
}