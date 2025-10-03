import G from '../assets/G_logo.svg'

const style = {
    backgroundColor:'white',
    border:'1px solid #D9D9D9',
    color:'#000000',
    fontWeight: 'bold',
    display:'flex',
    justifyContent: 'center',
    gap:'10px'
}

export default function Gbutton(){
    return(
        <button style={style}>
            <span><img src={G} alt="Google_logo"/></span>
            <span>Google</span>
        </button>
    )
};