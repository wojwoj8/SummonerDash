const ErrorPage = (props) =>{
    
    const {err} = props
    
    return (
        <div className="err-message">
            {err.status.status_code === 403 ?
                (<p>{err.status.status_code} - {err.status.message} (99% api expired)</p>):
                (<p>{err.status.status_code} - {err.status.message}</p>)
            }
        </div>
        
    )
}

export default ErrorPage;