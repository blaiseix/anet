import React from 'react'

const GeneralBanner = (props) => {
    const bannerClassName = `general-banner alert ${props.banner.statusColor}`
    
    return (
        <div className={bannerClassName}>
            <div className="messsage"><strong>Announcement:</strong> {props.banner.message}</div>
        </div>
    )
}

export default GeneralBanner