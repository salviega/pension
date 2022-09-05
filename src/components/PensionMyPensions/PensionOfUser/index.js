import React from "react"


function PensionOfUser({ age, biologySex, bornAge, id, owner, pensionCreatedTime, retirentmentData }) {    
    return (
        <div className="my-pensions-container__pensions-list__item">
            <div className="pension-item__header">
                <span className="pension-item__header__pension-name">Address: {owner}</span>
                <a href={`https://etherscan.io/address/${owner}`} className="pension-item__header__pension-address">Address: {owner}</a>
            </div>
            <div>
                <span className="pension-item__title">Id: </span>
                <span className="pension-item__value">{id}</span>
            </div>
            <div>
                <span className="pension-item__title">Age: </span>
                <span className="pension-item__value">{age}</span>
            </div>
            <div>
                <span className="pension-item__title">Biology sex: </span>
                <span className="pension-item__value">{biologySex}</span>
            </div>
            <div>
                <span className="pension-item__title">Year of bith: </span>
                <span className="pension-item__value">{bornAge}</span>
            </div>
            <div>
                <span className="pension-item__title">Mintend time: </span>
                <span className="pension-item__value">{pensionCreatedTime}</span>
            </div>
            <div>
                <span className="pension-item__title">retirentment data: </span>
                <span className="pension-item__value">{retirentmentData}</span>
            </div>
        </div>
    )
}

export { PensionOfUser }