const graphql = require("graphql");
const axios = require("axios");
const jf = require("jotform");
const { Kind } = require('graphql/language')


jf.options({
    debug: true,
    apiKey: "e38f97d7eb1d7cd322fcd9a66fddec33"
});


const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLScalarType,
    GraphQLSchema,
    GraphQLList,
    GraphQLBoolean,
    GraphQLNonNull,
} = graphql;


function getObject(value) {
    console.log("value", value)
    return value && !Array.isArray(value) && typeof value === 'object' ? value : isValidJson(value) ? JSON.parse(value) : null
}

function parseObject(ast) {
    switch (ast.kind) {
        case Kind.STRING:
        case Kind.BOOLEAN:
            return ast.value
        case Kind.INT:
        case Kind.FLOAT:
            return parseFloat(ast.value)
        case Kind.OBJECT: {
            const value = Object.create(null)
            ast.fields.forEach(field => {
                value[field.name.value] = parseObject(field.value)
            })
            return value
        }
        case Kind.LIST:
            return ast.values.map(parseObject)
        default:
            return null
    }
}

function isValidJson(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}

const JSONObjectType = new GraphQLScalarType({
    name: 'JSON_OBJECT',
    description: 'The `JSON_OBJECT` scalar type represents a JSON Object',
    serialize: getObject,
    parseValue: getObject,
    parseLiteral(ast) {
        console.log("AST", ast)
        return (ast.kind === Kind.OBJECT) ? parseObject(ast) : null
    }
})


const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        username: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        website: { type: GraphQLString },
        time_zone: { type: GraphQLString },
        account_type: { type: GraphQLString },
        status: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        is_verified: { type: GraphQLString },
        usage: { type: GraphQLString },
        language: { type: GraphQLString },
        v4: { type: GraphQLString },
        showJotFormPowered: { type: GraphQLString },
        cardForms: { type: GraphQLString },
        GDPR: { type: GraphQLString },
        signupModalType: { type: GraphQLString },
        folderLayout: { type: JSONObjectType },
        industry: { type: GraphQLString },
        company: { type: GraphQLString },
        jobTitle: { type: GraphQLString },
        avatarUrl: { type: GraphQLString },
        usage: {
            type: UsageType,
            resolve(parentValue, args) {
                return jf.getUsage().then(i => { console.log("USAGE", i); return i })
            }
        },
        submissions: {
            type: new GraphQLList(SubmissionType),
            resolve(parentValue, args) {
                return jf.getSubmissions().then(i => { console.log("SUBMISSIONS", i); return i })
            }
        },
        subusers: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return jf.getSubusers().then(i => { console.log("SUBUSERSS", i); return i })
            }
        },
        folders: {
            type: FolderType,
            resolve(parentValue, args) {
                return jf.getFolders().then(i => { console.log("FOLDERS", i); return i })
            }
        },
        reports: {
            type: new GraphQLList(ReportType),
            resolve(parentValue, args) {
                return jf.getReports().then(i => { console.log("REPORTS", i); return i })
            }
        },
        settings: {
            type: SettingType,
            resolve(parentValue, args) {
                return jf.getSettings().then(i => { console.log("SETTINGS", i); return i })
            }
        },
        history: {
            type: new GraphQLList(HistoryType),
            resolve(parentValue, args) {
                return jf.getHistory().then(i => { console.log("HISTORY", i); return i })
            }
        },
        forms: {
            type: new GraphQLList(FormType),
            resolve(parentValue, args) {
                return jf.getForms().then(i => { console.log("FORMS", i); return i })
            }
        }
    })
})

const FormType = new GraphQLObjectType({
    name: "Form",
    fields: {
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        title: { type: GraphQLString },
        height: { type: GraphQLString },
        url: { type: GraphQLString },
        status: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        new: { type: GraphQLString },
        count: { type: GraphQLString },
    }
})

const HistoryType = new GraphQLObjectType({
    name: "History",
    fields: () => ({
        type: { type: GraphQLString },
        formID: { type: GraphQLString },
        username: { type: GraphQLString },
        formTitle: { type: GraphQLString },
        formStatus: { type: GraphQLString },
        ip: { type: GraphQLString },
        timestamp: { type: GraphQLInt }
    })
})

const SettingType = new GraphQLObjectType({
    name: "Setting",
    fields: () => ({

        username: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        website: { type: GraphQLString },
        time_zone: { type: GraphQLString },
        account_type: { type: GraphQLString },
        status: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        usage: { type: GraphQLString },
        industry: { type: GraphQLString },
        securityAnswer: { type: GraphQLString },
        company: { type: GraphQLString },
        webhooks: { type: GraphQLString },
        doNotClone: { type: GraphQLString },
        avatarUrl: { type: GraphQLString },
    })
})

const FolderType = new GraphQLObjectType({
    name: "Folders",
    fields: () => ({
        id: { type: GraphQLString },
        path: { type: GraphQLString },
        owner: { type: GraphQLString },
        name: { type: GraphQLString },
        parent: { type: GraphQLString },
        color: { type: GraphQLString },
        forms: { type: new GraphQLList(JSONObjectType) },
        subfolders: { type: new GraphQLList(FolderType) }
    })
})

const ReportType = new GraphQLObjectType({
    name: "Reports",
    fields: () => ({
        id: { type: GraphQLString },
        form_id: { type: GraphQLString },
        title: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        fields: { type: GraphQLString },
        list_type: { type: GraphQLString },
        status: { type: GraphQLString },
        url: { type: GraphQLString },
        isProtected: { type: GraphQLBoolean },
    })
})

const SubmissionType = new GraphQLObjectType({
    name: "Submission",
    fields: {
        id: { type: GraphQLString },
        form_id: { type: GraphQLString },
        ip: { type: GraphQLString },
        created_at: { type: GraphQLString },
        status: { type: GraphQLString },
        new: { type: GraphQLString },
        flag: { type: GraphQLString },
        notes: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        answers: { type: JSONObjectType }
    }
})

const UsageType = new GraphQLObjectType({
    name: "Usage",
    fields: {
        submissions: { type: GraphQLString },
        ssl_submissions: { type: GraphQLString },
        payments: { type: GraphQLString },
        uploads: { type: GraphQLString },
        views: { type: GraphQLString },
        api: { type: GraphQLInt },
    }
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return jf.getUser().then(i => { console.log("USER ", i); return i })
            }
        },
        // company: {
        //     type: CompanyType,
        //     args: { id: { type: GraphQLString } },
        //     resolve(parentValue, args) {
        //         return axios.get(`${serverURL}/companies/${args.id}`).then(i => i.data)
        //     }
        // }
    }
})

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        register: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLInt) },
                email: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, args) {
                return jf.register(args).then(i => { console.log("USER REGISTER"); return i })
            }
        },
        login: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLInt) },
                appName: { type: GraphQLString },
                access: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                return jf.userLogin(args).then(i => { console.log("LOGIN"); return i })
            }
        },
        logout: {
            type: UserType,
            resolve(parentValue, args) {
                return jf.logout().then(i => { console.log("LOGOUT"); return i })
            }
        },
        settings: {
            type: SettingType,
            args: {
                apikey: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                website: { type: GraphQLString },
                time_zone: { type: GraphQLString },
                company: { type: GraphQLString },
                securityQuestion: { type: GraphQLString },
                securityAnswer: { type: GraphQLString },
                industry: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return jf.updateSettings(args).then(i => { console.log("SET Settings "); return i })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})