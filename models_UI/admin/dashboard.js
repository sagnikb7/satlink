var uiElements = [{
        card: {
            border: 'border-warning'
        },
        header: {
            title: 'Users',
            icon: 'fas fa-users',
            bgColor: 'pink lighten-3',
            textColor: 'text-black'
        },
        body: {
            text: 'Create and manage accounts of different users'
        },
        footer: {
            bgColor: 'pink lighten-4',
            textColor: 'text-black',

        },
        dropdown: [{
            title: 'Add',
            link: '/admin/user/add'
        }, {
            title:'Manage',
            link:'/admin/user/manage'
        }]

    },
    {
        card: {
            border: 'border-warning'
        },
        header: {
            title: 'Customers',
            icon: 'fas fa-user-tie',
            bgColor: 'purple lighten-3',
            textColor: 'text-black'
        },
        body: {
            text: 'Customer management'
        },
        footer: {
            bgColor: 'purple lighten-4',
            textColor: 'text-black',

        }, dropdown: [{
            title: 'Add',
            link: '/admin/customer/add'
        },{
            title: 'Manage Login',
            link: '/admin/customer/manage-login'
        }]


    },
    {
        card: {
            border: 'border-warning'
        },
        header: {
            title: 'Reports',
            icon: 'fas fa-poll-h',
            bgColor: 'orange lighten-3',
            textColor: 'text-black'
        },
        body: {
            text: 'Get all the reports and stats here'
        },
        footer: {
            bgColor: 'orange lighten-4',
            textColor: 'text-black',

        }

    }
];

module.exports = uiElements;