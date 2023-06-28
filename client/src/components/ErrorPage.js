const ErrorPage = (props) =>{
    
    const {err} = props
    
    return (
        <div className="error">
            {err ? (
                <div className="err-message">
                    {err.status.status_code === 403 ?
                (<p>{err.status.status_code} - {err.status.message} (99% api expired)</p>):
                (<p>{err.status.status_code} - {err.status.message}</p>)
            }
                </div>
            ) : (
                <div className="err-message">
                    <p>Something went wrong</p>
                    
                </div>
                
            )}
            <div className="error-gif">
                <img src="https://media.tenor.com/W_GgSsF7x9sAAAAi/amumu-sad.gif" alt='errorGIF'></img>       
            </div>
            
        </div>
        
    )
}

export default ErrorPage;