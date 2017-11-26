const smartgrid = require('smart-grid');

const settings = {
    outputStyle: 'styl',
    columns: 12,
    offset: '30px',
    container: {
        maxWidth: '1200px',
        fields: '30px'
    },
    breakPoints: {
        xl: {
            width: "1170px",
            fields: " 20px"
        },
        lg: {
            width: "960px",
            fields: "10px"
        },
        md: {
            width: "720px",
            fields: "5px"
        },
        sm: {
            width: "540px",
            fields: "5px"
        }
    },
    oldSizeStyle: false,
    properties: [
        'justify-content'
    ]
};

smartgrid('./app/precss/components', settings);