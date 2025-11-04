import deleteSvg from '../assets/deleteSvg.svg';

export default function DeliveryContainer({ deli, onUpdate, onDelete }) {
    return (
        <div style={{ display: 'flex', gap: '0.5em', width: '100%' }}>
            <input type="text" placeholder="Name" value={deli.name?? ''} style={{ flex: '1' }} onChange={(e) => onUpdate({ id: deli.id, name: e.target.value, link: deli.link })} />
            <input type="text" placeholder="Link" value={deli.link?? ''} style={{ flex: '4' }} onChange={(e) => onUpdate({ id: deli.id, name: deli.name, link: e.target.value })} />
            <div style={{justifyContent:'center',alignItems:'center'}}>
                <img src={deleteSvg} alt="delete" style={{ width: '100%', cursor: 'pointer',height:'100%'}} onClick={() => onDelete(deli)}/>
            </div>
        </div>
    ) 
}