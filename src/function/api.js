export function createApi(endpoint){
    if(window.location.origin === 'http://localhost:5173'){
        return 'http://localhost:3000/'+endpoint;
    }else{
        return 'https://appora.onrender.com/'+endpoint;
    }
}