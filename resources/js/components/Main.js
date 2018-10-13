import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Bar} from 'react-chartjs-2';

class Main extends Component {
    constructor() {

        super();
        //Initialize the state in the constructor
        this.state = {
            members: [],
            pagelinks: {prevPage: null, nextPage: null},
            data: {
                labels: ['2000', '2001', '2002', '2003', '2004', '2005', '2006'],
                datasets: [{
                        label: ['Members Data'],
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: [65, 59, 80, 81, 56, 55, 40]
                    }]
            },
            chartOptions: {}
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };
    handleClick(e) {
        e.preventDefault();
        let apiUrl = e.target.href;
        fetch(apiUrl.substr(apiUrl.indexOf('/api/'), apiUrl.length))
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    //Fetched product is stored in the state
                    const members = response.data;
                    const links = {prevPage: response.prev_page_url, nextPage: response.next_page_url};
                    this.setState({members: members});
                    this.setState({pagelinks: links});
                    this.forceUpdate();
                });
    };
    handleChange(e) {
        let queryUrl = '/api/members?firstname=' + document.getElementById("firstname").value;
        queryUrl += '&surname=' + document.getElementById("surname").value;
        queryUrl += '&email=' + document.getElementById("email").value;
        fetch(queryUrl)
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    //Fetched product is stored in the state
                    const members = response.data;
                    const links = {prevPage: response.prev_page_url, nextPage: response.next_page_url};
                    this.setState({members: members});
                    this.setState({pagelinks: links});
                    this.forceUpdate();
                });
    };

    /*componentDidMount() is a lifecycle method
     * that gets called after the component is rendered
     */
    componentDidMount() {
        fetch('/api/members/graph')
        .then(response => {
            return response.json();
        }).then(response => {
            const newdata = {
                labels: response.years,
                datasets: [{
                        label: 'Members Data',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: response.ctbyyear
                    }]
            };
            this.setState({data: newdata});
            const ctObj = response.ct;

            const chartOptions = {
                tooltips: {
                    callbacks: {
                        title: function (tooltipItem, data) {

                            //return data['labels'][tooltipItem[0]['index']]+"title";

                            return tooltipItem[0].xLabel;
                        },
                        label: function (tooltipItem, data) {
                            return tooltipItem.yLabel;
                        },
                        afterLabel: function (tooltipItem, data) {
                            var currentYear = tooltipItem.xLabel;
                            let content = "";
                            if (ctObj.hasOwnProperty(currentYear)) {
                                content = ctObj[currentYear].map(monthdata => {
                                    return monthdata.month + " : " + monthdata.count + "\n";
                                })
                            }
                            return content;
                        }
                    },
                    backgroundColor: '#FFF',
                    titleFontSize: 16,
                    titleFontColor: '#0066ff',
                    bodyFontColor: '#000',
                    bodyFontSize: 14,
                    displayColors: false
                }
            }
            this.setState({chartOptions: chartOptions});
       });

       fetch('/api/members')
       .then(response => {
           return response.json();
       }).then(response => {
            //Fetched product is stored in the state
            const members = response.data;
            const links = {prevPage: response.prev_page_url, nextPage: response.next_page_url};
            this.setState({members: members});
            this.setState({pagelinks: links});

        });
    };

    renderMembers() {
        return this.state.members.map(member => {
            return (
                    <tr key={member.id} >
                        <td>
                            { member.firstname } 
                        </td>
                        <td>
                            { member.surname } 
                        </td>
                        <td>
                            { member.email } 
                        </td>
                        <td>
                            { member.gender } 
                        </td>
                        <td>
                            { member.joined_date } 
                        </td>
                    </tr>
            );
        });
    };
    renderPagination() {
        let nextPage;
        if (this.state.pagelinks.nextPage !== null) {
            nextPage = <a className="btn btn-default active" href={this.state.pagelinks.nextPage} onClick={this.handleClick}>Next ❯</a>;
        } else {
            nextPage = <button className="btn btn-default diabled">Next ❯</button>;
        }
        let prevPage;
        if (this.state.pagelinks.prevPage !== null) {
            prevPage = <a className="btn btn-default active" href={this.state.pagelinks.prevPage} onClick={this.handleClick}>❮ Previous</a>;
        } else {
            prevPage = <button className="btn btn-default diabled">❮ Previous</button>;
        }
        return (<p>
            {prevPage} {nextPage}
            </p>);
    };
    render() {
        return (
                <div>
                    <Bar data={this.state.data} options={this.state.chartOptions} />
                    <br />
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>
                                Firstname 
                            </th>
                            <th>
                                Surname 
                            </th>
                            <th>
                                Email 
                            </th>
                            <th>
                                Gender 
                            </th>
                            <th>
                                Joined Date 
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <input type="text" id="firstname" onChange={this.handleChange} placeholder="First Name"/> 
                            </td>
                            <td>
                                <input type="text" id="surname" onChange={this.handleChange} placeholder="Last Name"/>
                            </td>
                            <td>
                                <input type="text" id="email" onChange={this.handleChange} placeholder="Email"/>
                            </td>
                            <td>
                                Gender 
                            </td>
                            <td>
                                Joined Date 
                            </td>
                        </tr>
                        { this.renderMembers() }
                        </tbody>
                    </table> 
                    { this.renderPagination() }
                </div>

        );
    }
}
export default Main;
if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'));
}

