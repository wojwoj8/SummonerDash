import ProfileRanks from "./ProfileRanks";
import ProfileMasteries from "./ProfileMasteries";
const ProfileData = (props) => {

    const {data, solo, flex, err, setButton, loading, masteries, button, 
        rateMess, setRateMess, setCoolDown, cooldown, setSeconds, seconds,
         lastGamesWinratio, role, setRole, display} = props;


    
    return(
        
            <div className="profile-data">

                <ProfileRanks
                        data={data}
                        solo={solo}
                        flex={flex}
                        err={err}
                        setButton={setButton}
                        loading={loading}
                        rateMess={rateMess}
                        setRateMess={setRateMess}
                        seconds={seconds}
                        setSeconds={setSeconds}
                        cooldown={cooldown}
                        setCoolDown={setCoolDown}
                />

                <ProfileMasteries
                    masteries={masteries}
                    lastGamesWinratio={lastGamesWinratio}
                    role={role}
                    setRole={setRole}
                    display={display}
                    button={button}
                    
                />
            </div>
     
    )

}

export default ProfileData;