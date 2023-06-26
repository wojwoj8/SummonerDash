const ProgressBar = ({fill}) =>{

    return (
        <div className="progressBar">
            {isNaN(fill) ?(
                <progress value={0} max={100}></progress>
            ):(
                <progress value={fill} max={100}></progress>
            )}
        </div>
        
    )
}
export default ProgressBar;