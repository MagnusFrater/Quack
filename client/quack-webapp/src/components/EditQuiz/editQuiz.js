import React, { Component, Fragment } from 'react';
import styles from './styles';
import { Link } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import {
    Grid, Col, Row, FormControl, FormGroup, 
    ListGroup, ListGroupItem, Modal, ControlLabel, 
    Button, DropdownButton, MenuItem, ButtonToolbar
} from '../../../node_modules/react-bootstrap';

class EditQuiz extends Component {
    state = {
        courseID: '',
        quizTitle: '',
        quizID: '',
        quizQuestions: [],
        show: false,
        showImg: false,
        newQuestionText: "",
        newQuestionType: "",
        newQuestionOptions: [],
        newQuestionImage: "",
        newQuestionAnswer: "",
        newQuestionTypeText: "",
        newQuestionMCoptions: ["", ""],
        newQuestionMCnum: 2,
        newImage: "",
        newImgQuestion: {},
    }
    
    constructor (props) {
        super(props);
        
        this.state = {
            courseID: props.match.params.courseID,
            quizTitle: props.location.state.quizTitle,
            quizQuestions: [],
            show: false,
            showImg: false,
            newQuestionText: "",
            newQuestionType: 0,
            newQuestionOptions: [],
            newQuestionImage: "",
            newQuestionAnswer: "",
            newQuestionTypeText: "Question type",
            newQuestionMCoptions: ["", ""],
            newQuestionMCnum: 2,
            newImg: "",
            quizID: props.match.params.quizID,
        }
        
        this.handleQuizTitle = this.handleQuizTitle.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.setAnswer = this.setAnswer.bind(this);
        this.handleChangeQT = this.handleChangeQT.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleQuestionType = this.handleQuestionType.bind(this);
        this.handleMCChange = this.handleMCChange.bind(this);
        this.addMCOption = this.addMCOption.bind(this);
        this.save = this.save.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.addImage = this.addImage.bind(this);
        this.handleCloseImg = this.handleCloseImg.bind(this);
        this.handleChangeImg = this.handleChangeImg.bind(this);
    }

    componentDidMount () {
        this.props.client.mutate({
            mutation: gql`mutation quizGetQuestions($id: Int!) {
                quizGetQuestions(id: $id) {
                    id
                    type
                    question
                    image
                    options
                    correctAnswer            
                }
            }`,
            variables: {
                id: this.state.quizID,
            }
        }).then(data => {
            var q = [];
            var qs = data.data.quizGetQuestions;

            for (var i = 0; i < qs.length; i++) {
                q.push({key: i + 1, num: i+1, type: qs[i].type, question: qs[i].question, options: qs[i].options.split(";"), image: qs[i].image, answer: qs[i].correctAnswer})
            }
            this.setState({quizQuestions: qs})
        });
    }

    handleQuizTitle (e) {
        this.setState({quizTitle: e.target.value})
    }

    addQuestion () {
        this.setState({show: true});
    }

    deleteQuestion(q) {
        var questions = this.state.quizQuestions.slice();
        var i;

        for (i = 0; i < questions.length; i++) {
            if (questions[i].question == q) {
                questions.splice(i, 1);
                break;
            }
        }
        
        for (i; i < questions.length; i++) {
            questions[i].key = questions[i].key - 1;
        }
        
        this.setState({quizQuestions: questions})
    }

    addImage (q) {
        this.setState({showImg: true, newImgQuestion: q})
    }

    handleCloseImg() {
        var url = this.state.newImg;
        var q = this.state.newImgQuestion;
        var questions = this.state.quizQuestions.slice();

        if (url == "") {
            this.setState({showImg: false, newImg: ""})
        } else {
            for (var i = 0; i < questions.length; i++) {
                if (questions[i].question == q) {
                    questions[i].image = url;
                    break;
                }
            }
            
            this.setState({showImg: false, newImg: "", quizQuestions: questions});
        }
    }

    handleChangeImg (e) {
        this.setState({newImg: e.target.value})
    }

    setAnswer (q, answer) {
        // loop through array for matching question and set answer
        var questions = this.state.quizQuestions.slice();
        questions.map((question) => {
            if (question.question == q) {
                question.correctAnswer = answer;
                return;
            }
        });
        
        this.setState({quizQuestions: questions});
    }

    handleClose () {
        var qType = this.state.newQuestionType;
        var questions = this.state.quizQuestions.slice();

        if (qType == 1) {
            // add MC question
            var newQ = {
                key: this.state.quizQuestions.length + 1,
                type: "mc", 
                question: this.state.newQuestionText,
                options: this.state.newQuestionMCoptions,
                image: "",
                answer: ""
            };

            questions.push(newQ);

            this.setState({
                quizQuestions: questions,
                show: false,
                newQuestionMCnum: 2,
                newQuestionType: 0, 
                newQuestionTypeText: 'Question type',
                newQuestionText: ""
            })
        } else if (qType == 2) {
            // add t/f question
            var newQ = {
                key: this.state.quizQuestions.length + 1,
                type: "tf", 
                question: this.state.newQuestionText,
                options: ["True", "False"],
                image: "",
                answer: ""
            };

            questions.push(newQ);

            this.setState({
                quizQuestions: questions,
                show: false,
                newQuestionMCnum: 2,
                newQuestionType: 0,
                newQuestionTypeText: 'Question type',
                newQuestionText: ""
            })
        } else if (qType == 3) {
            // add fill-in-the-blank quetion
            var newQ = {
                key: this.state.quizQuestions.length + 1,
                type: "fb", 
                question: this.state.newQuestionText,
                options: [],
                image: "",
                answer: ""
            };

            questions.push(newQ);

            this.setState({
                quizQuestions: questions,
                show: false,
                newQuestionMCnum: 2,
                newQuestionType: 0,
                newQuestionTypeText: 'Question type',
                newQuestionText: ""
            })
        } else if (qType == 4) {
            // add short answer question
            var newQ = {
                key: this.state.quizQuestions.length + 1,
                type: "sa", 
                question: this.state.newQuestionText,
                options: [],
                image: "",
                answer: ""
            };

            questions.push(newQ);

            this.setState({
                quizQuestions: questions,
                show: false,
                newQuestionMCnum: 2,
                newQuestionType: 0,
                newQuestionTypeText: 'Question type',
                newQuestionText: ""
            })
        } else {
            // just close
            this.setState({
                show: false,
                newQuestionText: "",
                newQuestionMCnum: 2,
                newQuestionType: 0,
                newQuestionTypeText: 'Question type',
                newQuestionMCoptions: []
            });
        }
    }
    
    handleChangeQT (e) {
        this.setState({newQuestionText: e.target.value})
    }

    handleQuestionType (e, type) {
        var typeText = "";

        if (type == 1) {
            typeText = "Multiple choice"
        } else if (type == 2) {
            typeText = "True/false"
        } else if (type == 3) {
            typeText = "Fill-in-the-blank"
        } else {
            typeText = "Short answer"
        }

        this.setState({newQuestionTypeText:  typeText, newQuestionType: type});
    }

    handleMCChange (num, e) {
        var n;
        var MCoptions = this.state.newQuestionMCoptions;
        MCoptions.splice(`${num - 1}`, 1, e.target.value);
        this.setState({newQuestionOptions: MCoptions});
    }

    addMCOption () {
        var num = this.state.newQuestionMCnum;
        num++;
        var mcOptions = this.state.newQuestionMCoptions.slice();
        mcOptions.splice(num, 0, "");
        this.setState({newQuestionMCnum: num, newQuestionMCoptions: mcOptions});
    }

    NewQuestionForm = ({type}) => {
        if (type == 1) {
            // mc question

            var optionInputs = [];
            for (var i = 1; i < this.state.newQuestionMCnum + 1; i++) {
                optionInputs.push(
                    <div key={`${i}`} style={{marginTop: '10px'}}><ControlLabel>Option {i}</ControlLabel>
                        <FormControl key={`${i}`} type="text"  value={this.state.newQuestionMCoptions[i - 1]} placeholder="" onChange={this.handleMCChange.bind(this, i)}/>
                    </div>
                );
            }

            return(
                <div>
                    <form>
                        <FormGroup>
                            {optionInputs}
                        </FormGroup>
                    </form>
                </div>
            );
        } else if (type == 2) {
            // true/false
            return(
                <div></div>
            );
        } else if (type == 3) {
            // fill-in-the-blank
            return null;
        } else if (type == 4){
            // short answer
            return null;
        } else {
            return(
                <p style={{fontFamily: 'Fira Sans', color: '#5A5A5A', fontSize: '12pt', fontWeight: 'regular'}}>
                    Choose question type
                </p>
            );
        }
    }

    save = async() => {
        // Here's where you'll save the quiz to the server
        await this.props.client.mutate({
            mutation: gql`mutation quizUpdate($id: Int!, $input: QuizInput) {
                quizUpdate(id: $id, input: $input) {
                    id
                }
            }`,
            variables: {
                id: this.state.quizID,
                input: {
                    title: this.state.quizTitle,
                    courseID: this.state.courseID,
                    qCount: this.state.quizQuestions.length,
                    date: '',
                    isOpen: false

                }
            }
        }).then( data => {
            for (var i = 0; i < this.state.quizQuestions.length; i++) {
                if (this.state.quizQuestions[i].id == null) {
                    this.props.client.mutate({
                        mutation: gql`mutation questionCreate($input: QuestionInput) {
                            questionCreate( input: $input) {
                                id
                            }
                        }`,
                        variables: {
                            input: {
                                quizID: this.state.quizID,
                                qIndex: this.state.quizQuestions[i].key,
                                type: this.state.quizQuestions[i].type,
                                question: this.state.quizQuestions[i].question,
                                image: this.state.quizQuestions[i].image,
                                options: this.state.quizQuestions[i].options.join(";"),
                                correctAnswer: this.state.quizQuestions[i].answer,
                                isManual: false
                            }
                        }
                    }).then(quest => {
                        console.log(quest);
                    })
                } else {
                    this.props.client.mutate({
                        mutation: gql`mutation questionUpdate($id: Int!, $input: QuestionInput) {
                            questionUpdate(id: $id, input: $input) {
                                id
                            }
                        }`,
                        variables: {
                            id: this.state.quizQuestions[i].id,
                            input: {
                                quizID: data.data.quizUpdate.id,
                                qIndex: this.state.quizQuestions[i].key,
                                type: this.state.quizQuestions[i].type,
                                question: this.state.quizQuestions[i].question,
                                image: this.state.quizQuestions[i].image,
                                options: this.state.quizQuestions[i].options.toString(),
                                correctAnswer: this.state.quizQuestions[i].answer,
                                isManual: false
                            }
                        }
                    }).then(quest => {
                        console.log(quest);
                    })
                }
            }
            this.setState({show: false})
        })
    }
    
    render() {
        const AddOptionButton = ({type}) => {
            if (type == 1) {
                return(<button style={styles.addQuestionButton} onClick={this.addMCOption}>add option</button>);
            } else {
                return null;
            }
        }

        return(
            <div style={{width: '100%', margin: '0px', padding: '0px', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>New Question</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <form>
                                <FormGroup>
                                    <ControlLabel>Enter question</ControlLabel>

                                    <FormControl
                                        type="text"
                                        value={this.state.newQuestionText}
                                        placeholder="Question text"
                                        onChange={this.handleChangeQT}
                                    />
                                    <FormControl.Feedback/>
                                </FormGroup>
                            </form>
                            
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <DropdownButton
                                    bsStyle="default"
                                    title={this.state.newQuestionTypeText}
                                    id="question-type-dropdown">
                                    <MenuItem eventKey={1} onSelect={(e) => this.handleQuestionType(e, 1)}>Multiple choice</MenuItem>
                                    <MenuItem eventKey={2} onSelect={(e) => this.handleQuestionType(e, 2)}>True/false</MenuItem>
                                    <MenuItem eventKey={3} onSelect={(e) => this.handleQuestionType(e, 3)}>Fill-in-the-blank</MenuItem>
                                    <MenuItem eventKey={4} onSelect={(e) => this.handleQuestionType(e, 4)}>Short answer</MenuItem>
                                </DropdownButton>

                                <AddOptionButton type={this.state.newQuestionType} />
                            </div>

                            <div style={{marginTop: '30px'}}>
                                <this.NewQuestionForm type={this.state.newQuestionType}/>
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={this.handleClose}>Add</Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.showImg} onHide={this.handleCloseImg}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add image</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <form>
                                <FormGroup>
                                    <ControlLabel>Enter Image URL</ControlLabel>

                                    <FormControl
                                        type="text"
                                        value={this.state.newImg}
                                        placeholder=""
                                        onChange={this.handleChangeImg}
                                    />
                                    <FormControl.Feedback/>
                                </FormGroup>
                            </form>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={this.handleCloseImg}>Add</Button>
                        </Modal.Footer>
                    </Modal>
                </div>

                <Grid style={{height: '92vh', width: 'auto', margin: '0px', padding: '0px', marginBottom: '-30px', marginLeft: '20px'}}>
                    <Row>
                        <div style={{margin: '0px', padding: '0px'}}>
                            <h1 style={styles.title}>Edit quiz</h1>
                        </div>
                    </Row>

                    <Row> 
                        <h1 style={styles.header}>Quiz title</h1>

                        <form style={{width: '500px'}}>
                            <FormGroup>
                                <FormControl
                                    type="text"
                                    value={this.state.quizTitle}
                                    placeholder={this.state.quizTitle}
                                    onChange={this.handleQuizTitle}
                                />
                                <FormControl.Feedback/>
                            </FormGroup>
                        </form>
                    </Row>

                    <Row style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                        <h1 style={styles.header}>Quiz questions</h1>

                        <button onClick={this.addQuestion} style={styles.button}>
                            add question
                        </button>
                    </Row>

                    <Row>
                        <QuizForm quizQuestions={this.state.quizQuestions} addQuestion={this.addQuestion} deleteQuestion={this.deleteQuestion} setAnswer={this.setAnswer} addImage={this.addImage}/>
                    </Row>
                </Grid>

                <div style={styles.footerRow}>
                    <div style={{display:'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: '100%'}}>
                        <Link
                            to={{
                                pathname: '/course/' + this.state.courseID, 
                                state: {
                                    courseID: this.state.courseID,
                                    courseTitle: this.props.location.state.courseTitle
                                }
                            }}
                            style={styles.saveButton}
                            onClick={this.save}
                        >
                            Save and return
                            <span>&#8594;</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default withApollo(EditQuiz);

class QuizForm extends Component {
    constructor(props) {
        super(props);

        this.setAnswer = this.setAnswer.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.addImage = this.addImage.bind(this);
    }

    newQuestion () {
        this.props.addQuestion("test");
    }

    deleteQuestion (q) {
        this.props.deleteQuestion(q);
    }

    addImage (q) {
        this.props.addImage(q);
    }

    setAnswer (question, answer) {
        this.props.setAnswer(question, answer);  // pass data up again to NewQuiz, where state and the array are
    }

    render () {
        // loop through quizQuestions array and render a {QuizQuestion} component for each
        var count = 0;
        const QuestionList = ({questions}) => (
            <Fragment>
                {questions.map(question => (
                    <QuizQuestion key={count++} num={count} question={question} setAnswer={this.setAnswer} deleteQuestion={this.deleteQuestion} addImage={this.addImage}/>
                ))}
            </Fragment>
        );

        return(
            <QuestionList questions={this.props.quizQuestions} />
        );
    }
}

class QuizQuestion extends Component {
    state = {
        selected: '',
        isHovering: false,
    }

    constructor (props) {
        super(props);

        this.state = {
            selected: "",
            isHovering: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.addImage = this.addImage.bind(this);
    }

    handleChange (e, question) {
        var answer = e.target.value;
        this.setState({selected: e.target.value})
        this.props.setAnswer(question, answer); // pass data up to QuizForm
    }

    handleMouseLeave () {
        this.setState({isHovering: false});
    }

    handleMouseEnter () {
        this.setState({isHovering: true});
    }

    deleteQuestion (question) {
        this.props.deleteQuestion(question);
        this.setState({isHovering: false})
    }

    addImage (question) {
        this.props.addImage(question);
        this.setState({isHovering: false});
    }

    render () {
        const question = this.props.question.question;
        var options = this.props.question.options.split(";");
        const image = this.props.question.image;
        const type = this.props.question.type;
        const num = this.props.num;
        const answer = this.props.question.correctAnswer;
        
        // MC
        if (type == "mc") {
            const optionsList = options.map((choice) =>
                <div key={choice.toString()} className="radio">
                    <label>
                        <input id={question} type="radio" value={`${choice}`} checked={answer ===`${choice}`} onChange={(e) => this.handleChange(e, question)} />
                        {choice}
                    </label>
                </div>
                
            );

            return(
                <div style={{width: '60%'}} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'baseline'}}>
                        <h1 style={styles.questionTitle}>{num}.) {question}</h1>

                        {this.state.isHovering &&
                            <div>
                                <button onClick={(e) => this.deleteQuestion(question)} style={styles.deleteButton}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg></button>
                                
                                <button onClick={(e) => this.addImage(question)} style={styles.imageButton}><svg width="24" height="24" viewBox="0 -10 100 100"><path style={{fill: 'black'}} d="M50,40c-8.285,0-15,6.718-15,15c0,8.285,6.715,15,15,15c8.283,0,15-6.715,15-15
                                    C65,46.718,58.283,40,50,40z M90,25H78c-1.65,0-3.428-1.28-3.949-2.846l-3.102-9.309C70.426,11.28,68.65,10,67,10H33
                                    c-1.65,0-3.428,1.28-3.949,2.846l-3.102,9.309C25.426,23.72,23.65,25,22,25H10C4.5,25,0,29.5,0,35v45c0,5.5,4.5,10,10,10h80
                                    c5.5,0,10-4.5,10-10V35C100,29.5,95.5,25,90,25z M50,80c-13.807,0-25-11.193-25-25c0-13.806,11.193-25,25-25
                                    c13.805,0,25,11.194,25,25C75,68.807,63.805,80,50,80z M86.5,41.993c-1.932,0-3.5-1.566-3.5-3.5c0-1.932,1.568-3.5,3.5-3.5
                                    c1.934,0,3.5,1.568,3.5,3.5C90,40.427,88.433,41.993,86.5,41.993z"/></svg>
                                </button>
                            </div>
                        }
                    </div>

                    <form>
                        {optionsList}
                    </form>
                </div>
            );
        } else if (type == "tf") {
            // True/false
            const optionList = (
                <div>
                    <div key="true" className="radio">
                        <label>
                            <input id="true" type="radio" value="True" checked={answer === "True"} onChange={(e) => this.handleChange(e, question)} />
                            True
                        </label>
                    </div>

                    <div key="false" className="radio">
                        <label>
                            <input id="false" type="radio" value="False" checked={answer === "False"} onChange={(e) => this.handleChange(e, question)} />
                            False
                        </label>
                    </div>
                </div>
            )

            return(
                <div style={{width: '60%'}} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'baseline'}}>
                        <h1 style={styles.questionTitle}>{num}.) {question}</h1>

                        {this.state.isHovering &&
                            <div>
                                <button onClick={(e) => this.deleteQuestion(question)} style={styles.deleteButton}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg></button>
                                
                                <button onClick={(e) => this.addImage(question)} style={styles.imageButton}><svg width="24" height="24" viewBox="0 -10 100 100"><path style={{fill: 'black'}} d="M50,40c-8.285,0-15,6.718-15,15c0,8.285,6.715,15,15,15c8.283,0,15-6.715,15-15
                                    C65,46.718,58.283,40,50,40z M90,25H78c-1.65,0-3.428-1.28-3.949-2.846l-3.102-9.309C70.426,11.28,68.65,10,67,10H33
                                    c-1.65,0-3.428,1.28-3.949,2.846l-3.102,9.309C25.426,23.72,23.65,25,22,25H10C4.5,25,0,29.5,0,35v45c0,5.5,4.5,10,10,10h80
                                    c5.5,0,10-4.5,10-10V35C100,29.5,95.5,25,90,25z M50,80c-13.807,0-25-11.193-25-25c0-13.806,11.193-25,25-25
                                    c13.805,0,25,11.194,25,25C75,68.807,63.805,80,50,80z M86.5,41.993c-1.932,0-3.5-1.566-3.5-3.5c0-1.932,1.568-3.5,3.5-3.5
                                    c1.934,0,3.5,1.568,3.5,3.5C90,40.427,88.433,41.993,86.5,41.993z"/></svg>
                                </button>
                            </div>
                        }
                    </div>

                    <form>
                        {optionList}
                    </form>
                </div>
            );
        } else if(type == "fb") {
            // Fill in the blank
            return (
                <div style={{width: '60%'}} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'baseline'}}>
                        <h1 style={styles.questionTitle}>{num}.) {question}</h1>

                        {this.state.isHovering &&
                            <div>
                                <button onClick={(e) => this.deleteQuestion(question)} style={styles.deleteButton}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg></button>
                                
                                <button onClick={(e) => this.addImage(question)} style={styles.imageButton}><svg width="24" height="24" viewBox="0 -10 100 100"><path style={{fill: 'black'}} d="M50,40c-8.285,0-15,6.718-15,15c0,8.285,6.715,15,15,15c8.283,0,15-6.715,15-15
                                    C65,46.718,58.283,40,50,40z M90,25H78c-1.65,0-3.428-1.28-3.949-2.846l-3.102-9.309C70.426,11.28,68.65,10,67,10H33
                                    c-1.65,0-3.428,1.28-3.949,2.846l-3.102,9.309C25.426,23.72,23.65,25,22,25H10C4.5,25,0,29.5,0,35v45c0,5.5,4.5,10,10,10h80
                                    c5.5,0,10-4.5,10-10V35C100,29.5,95.5,25,90,25z M50,80c-13.807,0-25-11.193-25-25c0-13.806,11.193-25,25-25
                                    c13.805,0,25,11.194,25,25C75,68.807,63.805,80,50,80z M86.5,41.993c-1.932,0-3.5-1.566-3.5-3.5c0-1.932,1.568-3.5,3.5-3.5
                                    c1.934,0,3.5,1.568,3.5,3.5C90,40.427,88.433,41.993,86.5,41.993z"/></svg>
                                </button>
                            </div>
                        }
                    </div>

                    <h3 style={styles.accent}>Fill-in-the-blank question</h3>
                </div>
            );
        } else if (type == "sa") {
            // Short answer
            return (
                <div style={{width: '60%'}} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'baseline'}}>
                        <h1 style={styles.questionTitle}>{num}.) {question}</h1>

                        {this.state.isHovering &&
                            <div>
                                <button onClick={(e) => this.deleteQuestion(question)} style={styles.deleteButton}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg></button>
                                
                                <button onClick={(e) => this.addImage(question)} style={styles.imageButton}><svg width="24" height="24" viewBox="0 -10 100 100"><path style={{fill: 'black'}} d="M50,40c-8.285,0-15,6.718-15,15c0,8.285,6.715,15,15,15c8.283,0,15-6.715,15-15
                                    C65,46.718,58.283,40,50,40z M90,25H78c-1.65,0-3.428-1.28-3.949-2.846l-3.102-9.309C70.426,11.28,68.65,10,67,10H33
                                    c-1.65,0-3.428,1.28-3.949,2.846l-3.102,9.309C25.426,23.72,23.65,25,22,25H10C4.5,25,0,29.5,0,35v45c0,5.5,4.5,10,10,10h80
                                    c5.5,0,10-4.5,10-10V35C100,29.5,95.5,25,90,25z M50,80c-13.807,0-25-11.193-25-25c0-13.806,11.193-25,25-25
                                    c13.805,0,25,11.194,25,25C75,68.807,63.805,80,50,80z M86.5,41.993c-1.932,0-3.5-1.566-3.5-3.5c0-1.932,1.568-3.5,3.5-3.5
                                    c1.934,0,3.5,1.568,3.5,3.5C90,40.427,88.433,41.993,86.5,41.993z"/></svg>
                                </button>
                            </div>
                        }
                    </div>

                    <h3 style={styles.accent}>Short answer question</h3>
                </div>
            );
        } else {
            return null;
        }
    }
}