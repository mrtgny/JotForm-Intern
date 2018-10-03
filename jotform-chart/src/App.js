import React, { Component } from 'react';
import './css/App.css';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } from 'bizcharts'
import LogoPNG from './images/logo.png'

const questionSheetData = {}

const jsonData = {}

class Logo extends React.Component {
    render() {
        return (
            <img src={LogoPNG} width={"164"} height="55" />
        )
    }
}

class Header extends React.Component {
    render() {
        return (
            <div className={"header-container"}>
                <Logo />
                <FormTitle />
                <UserInfo />
            </div>
        )
    }
}

class FormTitle extends React.Component {
    render() {
        return (
            <div className="header-form-title">
                JotFrom Chart
            </div>
        )
    }
}

class UserInfo extends React.Component {
    render() {
        return (
            <div className="header-user-info">
                <div className="centered-item">
                    <div style={{ padding: 8 }}>
                        <i className="material-icons" style={{ color: "white", fontSize: 64 }}>person</i>
                    </div>
                    <div>
                        <p>Murat</p>
                        <p>Güney</p>
                    </div>
                </div>
            </div>
        )
    }
}

class CommandBarButton extends React.Component {
    render() {
        const { title, icon, badge, badgeColor, menu } = this.props;
        return (
            <div className="commandbar-button">
                {badge ?
                    <div className="commandbar-button-badge centered-item" style={{ backgroundColor: badgeColor }}>
                        {badge}
                    </div>
                    : null}
                {icon ?
                    <div className="commandbar-button-icon-container centered-item">
                        <i className="material-icons commandbar-button-icon">{icon}</i>
                    </div> : null}
                <div className="commandbar-button-title">
                    {title}
                </div>

            </div>
        )
    }
}

class SearchBox extends React.Component {
    render() {
        return (
            <div className="search-box-container">
                <input type="text" placeholder="Submissions" className="search-box" />
                <div className="search-box-icon">
                    <i className="material-icons">search</i>
                </div>
            </div>
        )
    }
}

class CommandBar extends React.Component {
    render() {
        return (
            <div className="commandbar-container">
                <SearchBox />
                <div style={{ display: "flex", height: "100%" }}>
                    <CommandBarButton title="Submissions" badge={9} badgeColor={"#1890ff"} icon="expand_more" />
                    <CommandBarButton title="Unread" badge={"0"} badgeColor={"#52c41a"} icon="expand_more" />
                </div>
            </div>
        )
    }
}

class Content extends React.Component {
    render() {
        return (
            <div className="content-container">
                <CommandBar />
                <div style={{ display: "flex", height: "100%", width: "100%", position: "relative", paddingTop: 16 }}>
                    <div style={{ position: "sticky", backgroundColor: "#eee", width: 300, top: 8, height: "calc(100vh - 16px)" }}>
                        <PlaceHolder />
                    </div>
                    <div style={{ maxWidth: 500, width: "100%" }}>
                        <ChartContainer />
                    </div>
                </div>
            </div>
        )
    }
}

const PlaceHolder = () => {
    return (
        <div style={{ width: "100%" }}>
            <div style={{ width: "calc(100% - 150px)", height: 20, margin: 16, backgroundColor: "#ddd" }}></div>
            <div style={{ width: "calc(100% - 100px)", height: 20, margin: 16, backgroundColor: "#ddd" }}></div>
            <div style={{ width: "calc(100% - 100px)", height: 20, margin: 16, backgroundColor: "#ddd" }}></div>
            <div style={{ width: "calc(100% - 100px)", height: 20, margin: 16, backgroundColor: "#ddd" }}></div>
            <div style={{ width: "calc(100% - 100px)", height: 20, margin: 16, backgroundColor: "#ddd" }}></div>
        </div>
    )
}

class App extends React.Component {
    render() {
        return (
            <div className={"container"}>
                <Header />
                <Content />
            </div>
        )
    }
}

class ChartContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            loading: true
        }
        this.supportedFields = ["control_yesno", "control_radio", "control_checkbox"]
    }

    oldChartDrawer() {
        const questionStruct = questionSheetData.content;

        const checkListStruct = JSON.parse(questionStruct[Object.keys(questionStruct).length - 1].options_array);


        const labelListStruct = JSON.parse(questionStruct[Object.keys(questionStruct).length].options_array);

        const answerCheckListCount = {};
        const answerLabelListCount = {};

        jsonData.content.forEach((submission) => {
            const _answer = submission.answers;
            _answer[Object.keys(_answer).length - 1].answer.forEach(answer => {
                const tmpans = answer.replace("{", "").replace("}", "");
                answerCheckListCount[tmpans] = answerCheckListCount[tmpans] !== undefined ? answerCheckListCount[tmpans] + 1 : 1;
            })

            _answer[Object.keys(_answer).length].answer.forEach(answer => {
                const tmpans = answer.replace("{", "").replace("}", "");
                answerLabelListCount[tmpans] = answerLabelListCount[tmpans] !== undefined ? answerLabelListCount[tmpans] + 1 : 1;
            })
        });

        const checkList = Object.keys(checkListStruct).map((key) => ({
            name: checkListStruct[key].value,
            key,
            value: answerCheckListCount[key] || 0
        }));
        const labelList = Object.keys(labelListStruct).map((key) => ({
            name: labelListStruct[key].value,
            key,
            color: labelListStruct[key].color,
            value: answerLabelListCount[key] || 0
        }));

        this.setState({ checkList, labelList, answerCheckListCount, answerLabelListCount });
    }

    getChartData(fields, questionSheetData, jsonData) {
        const questions = Object.keys(questionSheetData.content).map(i => questionSheetData.content[i]);
        const answers = jsonData.content.map(i => Object.keys(i.answers).map(i2 => i.answers[i2]))
        this.submissionCount = answers.length
        fields.forEach((field, index) => {
            questions.forEach((question, qindex) => {

                if (question.type == field) {
                    const fieldAnswerCount = {};

                    answers.forEach((_answer) => {
                        if (_answer[qindex].answer instanceof Array) {
                            _answer[qindex].answer.forEach(answer => {
                                const tmpans = answer.replace("{", "").replace("}", "");
                                fieldAnswerCount[tmpans] = fieldAnswerCount[tmpans] !== undefined ? fieldAnswerCount[tmpans] + 1 : 1;
                            })
                        } else if (typeof (_answer[qindex].answer) === 'string' || _answer[qindex].answer instanceof String) {
                            const tmpans = _answer[qindex].answer.replace("{", "").replace("}", "");
                            fieldAnswerCount[tmpans] = fieldAnswerCount[tmpans] !== undefined ? fieldAnswerCount[tmpans] + 1 : 1;
                        } else {
                            console.error("UNEXPECTED TYPE", _answer[qindex].answer);
                        }
                    });

                    let answerList = []
                    if (question.options_array) {
                        answerList = Object.keys(JSON.parse(question.options_array)).map((key) => ({
                            ...JSON.parse(question.options_array)[key],
                            name: JSON.parse(question.options_array)[key].value,
                            key,
                            value: fieldAnswerCount[key] || 0
                        }));
                    } else if (question.options) {
                        answerList = question.options.split("|").map((key) => ({
                            name: key,
                            key,
                            value: fieldAnswerCount[key] || 0
                        }));
                    } else {
                        console.error("UNEXPECTED DATA")
                    }

                    this.setState(prevState => ({ data: [...prevState.data, answerList] }))
                }
            })
        })

    }

    componentWillMount() {
        const apiKey = "e38f97d7eb1d7cd322fcd9a66fddec33";
        const formId = "81712777523966"
        fetch(
            `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).then(i => i.json()).then(i => {
            fetch(
                `https://api.jotform.com/form/${formId}/questions?apiKey=${apiKey}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            ).then(i2 => i2.json()).then(i2 => {
                this.setState({ loading: false }, () =>
                    this.getChartData(this.supportedFields, { ...i2, content: Object.keys(i2.content).map(obj => i2.content[obj]) }, i)
                )
            })
        }
        )
    }

    calcScale(data) {
        return {
            name: {
                type: 'cat',
                formatter: function (dimValue) {
                    return dimValue;
                },
                alias: "submission"
            },
            value: {
                min: 0,
                max: this.submissionCount,
                alias: "Submissions"
            }
        };
    }

    render() {


        return (
            <div>

                {this.state.loading && !this.state.data.length ?
                    <div style={{ width: "100%", height: "calc(100vh - 200px)" }} className="centered-item">
                        <div className="yin-yang">

                        </div>
                    </div>
                    : this.state.data.map((data, index) => {
                        return (
                            [<BarChart data={data} scale={this.calcScale()} key={index + "bar"} />,
                            <RadialChart data={data} key={index + "radial"} />,

                            ]
                        )
                    })}

            </div>
        )
    }

}

const RadialChart = props => {
    const { data } = props;
    return (
        <div style={{ width: "100%", display: "inline-block" }}>
            <Chart height={window.innerHeight / 2} data={data} forceFit>
                <Coord type="theta" radius={0.8} />
                <Tooltip />
                <Geom type="intervalStack" position="value" color="name" shape="sliceShape">
                    <Label content="name" />
                </Geom>
            </Chart>
        </div>
    )
}

const BarChart = props => {
    const { data, scale } = props;
    return (
        <div style={{ width: "100%", display: "inline-block" }}>
            <Chart
                height={window.innerHeight / 2} data={data} scale={scale} forceFit>
                <Axis name="value" title />
                <Legend visible={false} />
                <Geom type="interval" position="name*value" color="name" />
            </Chart>
        </div>
    )
}

export default App;
