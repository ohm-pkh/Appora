export function CloseBtn(onClose){
    return(
        <button onClick={onClose}>Close</button>
    )
}

export function SaveBtn(onSave,onClose,data,error=false){
    function save(){
        let err = false;
        if(error){
            err = onSave(data);
        }else{
            onSave(data);
        }
        if(err !== false){
            onClose();
        }
        
    }

    return(
        <button onClick={()=>save()}>Save</button>
    )
}

export default function OverlayBtn(params){
    return(
        <div style={{marginTop:"1em", display:'flex', gap:'1.5em', justifyContent:'end', width:'100%'}}>
            {CloseBtn(params.onClose)}
            {SaveBtn(params.onSave,params.onClose,params.data,params.error)}
        </div>
    )
}