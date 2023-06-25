import { useState } from "react";
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import ProfileRanks from "./ProfileRanks";
import ProfileMasteries from "./ProfileMasteries";
const ProfileData = (props) => {

    const {data, solo, flex, err, setButton, loading, masteries, 
        rateMess, setRateMess, setCoolDown, cooldown, setSeconds, seconds} = props;

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
            />
            </div>
     
    )

}

export default ProfileData;