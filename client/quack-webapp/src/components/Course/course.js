import React from 'react';
import { Component } from 'react';
import { colors } from '../../styles/styles'
import styles from './styles'
import {  } from 'react-router-dom';
import { Grid, Col, Row, Tabs, Tab } from '../../../node_modules/react-bootstrap'
import CourseDetails from '../CourseDetails/courseDetails';
import CourseRoster from '../CourseRoster/courseRoster'
import CourseRoles from '../CourseRoles/courseRoles';
import CourseQuizzes from '../CourseQuizzes/courseQuizzes';
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag';
import TransitionGroup, { Transition } from 'react-transition-group/TransitionGroup';

class Course extends Component {
    state = {
        courseID: "6969",
        courseTitle: "ABC123: Course Title",
        courseDescription: "Software Engineering",
        courseRoster: ['Theo', 'Mason', 'Justin', 'Todd', 'Tyler'],
        courseQuizzes: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'],
        key: 1,
        courseSections: [],
    }

    constructor(props) {
        super(props);

        this.state = {
            courseTitle: props.location.state.courseTitle,
            courseID: props.courseID,
            key: 1,
            courseSections: [],
        }
        
        this.handleSelect = this.handleSelect.bind(this);
        this.updateDetails = this.updateDetails.bind(this);
    }

    handleSelect(key) {
        this.setState({ key: key });
    }

    updateDetails(title, description) {
        this.setState({
            courseTitle: title,
            courseDescription: description
        });
    }

    render () {
        return(
            <TransitionGroup>
                <div style={{width: '100%'}}>
                    <Grid style={{width: '100%', margin: '0px', padding: '0px', marginLeft: '20px'}}>
                        <Row>
                            <div style={{margin: '0px', padding: '0px'}}>
                                <h1 style={styles.title}>{this.state.courseTitle}</h1>
                            </div>
                        </Row>

                        <Row>
                            <div style={styles.tab_menu}>
                                <Tabs
                                    activeKey={this.state.key}
                                    onSelect={this.handleSelect}
                                    id="course-tabs"
                                >
                                    <Tab eventKey={1} title="Course Details">
                                        <CourseDetails 
                                            courseID={this.state.courseID} 
                                            courseTitle={this.state.courseTitle}
                                            courseDescription={this.state.courseDescription}
                                            callback={this.updateDetails}
                                            />
                                    </Tab>

                                    <Tab eventKey={2} title="Quizzes">
                                        <CourseQuizzes courseID={this.state.courseID} courseTitle={this.state.courseTitle}/>
                                    </Tab>

                                    <Tab eventKey={3} title="Roster">
                                        <CourseRoster courseID={this.state.courseID} />
                                    </Tab>
                                </Tabs>
                            </div>
                        </Row>
                    </Grid>
                </div>
            </TransitionGroup>
        );
    }
}

export default withApollo(Course);