import { useState } from "react";
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import ProfileRanks from "./ProfileRanks";
import ProfileMasteries from "./ProfileMasteries";
const ProfileData = (props) => {

    const {data, solo, flex, err, setButton, loading, masteries} = props;

    return(
        <div className="profile-data">
            {/* <div className="profile"> */}

            
        
        <ProfileRanks
                data={data}
                solo={solo}
                flex={flex}
                err={err}
                setButton={setButton}
                loading={loading}
        />

        <ProfileMasteries
            masteries={masteries}
            />
            {/* </div> */}
        </div>
    )

}

export default ProfileData;