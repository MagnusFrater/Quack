import React, { Component, Fragment } from 'react';
import styles from './styles';
import { Grid, Col, Row, Button} from '../../../node_modules/react-bootstrap';
import { Link } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import io from 'socket.io-client';

class StartQuiz extends Component {

    state = {
        quizID: '',
        quizQuestions: [],
        answers: [],
        quizTitle: '',
        courseID: '',
        attendance: 0,
        sectionSize: 0,
        data: [],
    }

    labels = ['Finished', 'Incomplete'];
    bgColors = ['#057B65', '#A1A1A1'];
    bColors = ['#046150', '#5A5A5A'];

    constructor(props) {
        super(props)

        // need to download quiz questions, section size

        this.state = {
            courseID: props.location.state.courseID,
            quizID: props.match.params.quizID,
            quizTitle: props.location.state.quizTitle,
            attendance: 0,
            sectionSize: 0,
            quizQuestions: [],
            answers: [],
            data: [0, 69],
        }

        this.update = this.update.bind(this);

        const socket = io('http://endor-vm2.cs.purdue.edu:5000');
        socket.emit("subscribe", "quiz_answer_created", props.match.params.quizID);
        socket.on("quiz_answer_created", this.update);
    }

    update(answer) {
        console.log(answer);
        console.log("Quiz update received");

        var a = this.state.answers;
        a.push(answer);
        this.setState({answers: a});
    }

    

    render() {

        var r = this.parseAnswers();        
        var count = 0;
        const QuestionList = ({questions}) => (
            <Fragment>
                {questions.map(question => (
                    <Question key={count++} question={question} results={r} />
                ))}
            </Fragment>
        );

        const data = {
            labels: this.labels,
            datasets: [{
                data: this.state.data,
                backgroundColor: this.bgColors,
                hoverBackgroundColor: this.bColors,
            }]
        }

        return(
            <div>
                <Grid style={{height: '92vh', width: 'auto', margin: '0px', padding: '0px', marginBottom: '-30px', marginLeft: '20px'}} ref="mainGrid">
                    <Row>
                        <div style={{margin: '0px', padding: '0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'baseline'}}>
                        <h1 style={styles.title}>{this.state.quizTitle}</h1>
                        <h2 style={{...styles.subtitle, ...{marginLeft: '20px'}}}>Live</h2>
                        <svg height="50" width="50">
                            <circle cx="15" cy="43" r="6" strokeWidth="3" fill="#C73700" />
                        </svg>
                        </div>
                    </Row>
                    <Row>
                        <h2 style={styles.attendance}>Responses: {this.state.attendance}/{this.state.sectionSize}</h2>
                    </Row>
                    <Row>
                        <Col sm={6} >
                        <Doughnut data={data} options={{ maintainAspectRatio: false, legend: { position: 'left' }}}/>
                        </Col>
                    </Row>
                    <Row>
                        <QuestionList questions={this.state.quizQuestions} />
                    </Row>
                </Grid>

                <div style={styles.footerRow}>
                    <div style={{display:'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: '100%'}}>
                        <Link to={{pathname: '/course/' + this.state.courseID + '/view/' + this.state.quizID, 
                            state: {courseID: this.props.courseID, quizTitle: this.props.location.state.courseTitle, quizID: this.state.quizID}
                        }} style={styles.saveButton} onClick={this.save}>Close quiz & view results <span>&#8594;</span></Link>
                    </div>
                </div>
            </div>
        );
    }

    parseAnswers() {

        var answers = this.state.answers;
        var questions = this.state.quizQuestions;
        var numQuestions = 0;
        for(var i = 0; i < answers.length; i++) {
            if(answers[i].qNum > numQuestions) {
                numQuestions = answers[i].qNum;
            }
        }

        var results = [];   // {key: 1, options: [x, x, x, x, etc.]}
        for(var i = 0; i < numQuestions; i++) {
            results[i] = {key: i + 1, options: []};
            for(var j = 0; j < questions[i].options.length; j++) {
                results[i].options.push(0);
            }
        }
        console.log(results)

        for(var i = 0; i < answers.length; i++) {
            var choice = questions[answers[i].qNum - 1].options.indexOf(answers[i].content);
            var numOptions = questions[answers[i].qNum - 1].options.length;
            var temp = results[answers[i].qNum - 1].options;
            var currentCount = results[answers[i].qNum - 1].options[choice];
            currentCount =  currentCount + 1;
            temp.splice(choice, 1, currentCount);
            results[answers[i].qNum - 1].options = temp;
        }

        if(this.refs.mainGrid) {
            this.setState({
                results: results,
            })
        }

        return results;
        
    }
}
export default StartQuiz

class Question extends Component {

    constructor(props) {
        super(props);
        console.log(props)
    }

    // results for question are in results[questionKey - 1]

    render() {

        // create data object
        var bgColors = [];
        var borderColors = [];
        var labels = [];
        var results = this.props.results;
        var correctIndex = this.props.question.options.indexOf(this.props.question.answer);
        for(var i = 0; i < this.props.question.options.length; i++) {
            if(i == correctIndex) {
                bgColors.push('#057B65');
                borderColors.push('#046150');
            }else {
                bgColors.push('#A1A1A1');
                borderColors.push('#5A5A5A');
            }

            labels.push(this.props.question.options[i].toString());
        }
        
        var data = {
            labels: labels,
            datasets: [{
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 1,
                data: results[this.props.question.key - 1].options,
            }]
        }

        return(
            <div>
            <div style={styles.questionTitle}>{this.props.question.key}.) {this.props.question.question}</div>
            <div style={{width: '80%', marginTop: '15px'}}>
                <Bar data={data} options={{ legend: { display: false } }}/>
            </div>
            </div>
        );
    }
}