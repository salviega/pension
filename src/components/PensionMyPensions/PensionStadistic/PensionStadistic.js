import React from "react";

function PensionStadistic({ pensionData = {} }) {
    return (
        <div className="my-pensions-container__pensions-stadistic">
            <img src="https://www.canada.ca/content/dam/canada/tbs-sct/migration/psm-fpfm/pensions/publications/reports-rapports/rpspp-rrrso/2016/images/Figure03-eng.png" />
        </div>
    )
}

export {
    PensionStadistic
}