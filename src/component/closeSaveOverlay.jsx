export function CloseBtn(onClose){
    return(
        <button onClick={onClose}>Close</button>
    )
}

export function SaveBtn(onSave,onClose,data){
    function save(){
        onSave(data);
        onClose();
    }

    return(
        <button onClick={()=>save()}>Save</button>
    )
}

export default function OverlayBtn(params){
    return(
        <div style={{marginTop:"1em", display:'flex', gap:'1.5em', justifyContent:'end', width:'100%'}}>
            {CloseBtn(params.onClose)}
            {SaveBtn(params.onSave,params.onClose,params.data)}
        </div>
    )
}