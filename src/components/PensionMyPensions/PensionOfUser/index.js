import React from "react"


function PensionOfUser({ pensionAddress, PensionName, totalContributions, totalReturns, }) {

    return (
        <div className="my-pensions-container__pensions-list__item">
            <div className="pension-item__header">
                <span className="pension-item__header__pension-name">{PensionName}</span>
                <a href="https://etherscan.io/" className="pension-item__header__pension-address">{pensionAddress}</a>
            </div>
            <div>
                <span className="pension-item__title">Contributions: </span>
                <span className="pension-item__value">{totalContributions}</span>
            </div>
            <div>
                <span className="pension-item__title">Returns: </span>
                <span className="pension-item__value">{totalReturns}</span>
            </div>
        </div>
    )
}

export { PensionOfUser }