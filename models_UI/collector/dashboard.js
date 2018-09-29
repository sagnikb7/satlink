var uiElements = [{
    card: {
        border: 'border-warning'
    },
    header: {
        title: 'Payment',
        icon: 'fas fa-money-check-alt',
        bgColor: 'lime lighten-3',
        textColor: 'text-black'
    },
    body: {
        text: 'Record and review payments'
    },
    footer: {
        bgColor: 'lime lighten-4',
        textColor: 'text-black',

    },
    dropdown: [{
        title: 'Collect',
        link: '/collector/payment/collect'
    }, {
        title: 'Review',
        link: ''
    }],
    badges: {
        badge1: {
            icon: '',
            data: ''
        },
        badge2: {
            icon: '',
            data: ''
        },
        badge3: {
            icon: '',
            data: ''
        }
    }

}];

module.exports = uiElements;