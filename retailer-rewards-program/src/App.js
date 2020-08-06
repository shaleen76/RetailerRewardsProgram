import React, { useState, useEffect } from "react";
import data from "../src/assets/data/mock-data.json";
import ReactTable from 'react-table';
import "./App.css";
import "react-table/react-table.css";
import _ from 'lodash';

function calculateResults(data) {
  let calendarMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let customer = {};
  let totalPoints = {};
  let points = data.map((transaction) => {
    let computedPoints = 0;
    
    if (transaction.transactionAmount >= 50) {     
      computedPoints += 50;
    }    
    if ((transaction.transactionAmount - 100) > 0) {
      computedPoints += ((transaction.transactionAmount - 100) * 2);      
    }
    let transactionMonth = new Date(transaction.transactionDate).getMonth() + "";
    return {...transaction, computedPoints, transactionMonth};
  });
  // eslint-disable-next-line   
  points.map((transaction) => {
    let {customerName, transactionMonth, computedPoints} = transaction;   
    if (!customer[customerName]) {
      customer[customerName] = [];      
    }    
    if (!totalPoints[customerName]) {
      totalPoints[customerName] = 0;
    }
    totalPoints[customerName] += computedPoints;
    if (customer[customerName][transactionMonth]) {
      customer[customerName][transactionMonth].points += computedPoints;
      customer[customerName][transactionMonth].monthNumber = transactionMonth;
      customer[customerName][transactionMonth].totalTransaction++;      
    }
    else {
      customer[customerName][transactionMonth] = {
        name: customerName,
        monthNumber:transactionMonth,
        month: calendarMonths[transactionMonth],
        totalTransaction: 1,        
        points: computedPoints
      }
    }    
  });
  let total = [];
  for (let key in customer) {   
    customer[key].forEach(cRow=> {
      total.push(cRow);
    });    
  }

  let pointsPerCustomer = [];
  for (let key in totalPoints) {  
    console.log('total ', totalPoints);  
    pointsPerCustomer.push({
      name: key,
      points: totalPoints[key]
    });    
  }
  console.log('ccc ', pointsPerCustomer);
  return {
    summaryByCustomer: total,
    points: points,
    totalPointsPerCustomer: pointsPerCustomer
  };
}

function App() {
  const [transactionData, setTransactionData] = useState(null);
  console.log('transac ', transactionData)
  const tableColumn = [
    {
      Header:'Customer',
      accessor: 'name'      
    },    
    {
      Header:'Month',
      accessor: 'month'
    },
    {
      Header: "Total Transactions",
      accessor: 'totalTransaction'
    },
    {
      Header:'Reward Points',
      accessor: 'points'
    }
  ];
  const totalsColumn = [
    {
      Header:'Customer',
      accessor: 'name'      
    },    
    {
      Header:'Total Points',
      accessor: 'points'
    }
  ]

  function getEachTransaction(row) {
    return _.filter(transactionData.pointsPerTransaction, (row) => {    
      return row.original.name === row.customerName && row.original.monthNumber === row.month;
    });
  }

  useEffect(() => { 
    setTransactionData(calculateResults(data));
  },[]);

  return transactionData == null ? <div>
    Loading ...
  </div> :
  <div className="container">
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
        <h4 className="ml-4">Total Points Table Per Customer and Per Month</h4>
      </div>
    </div>
    <div className="row">
      <div className="col-8">
        <ReactTable
          data={transactionData.summaryByCustomer}
          defaultPageSize={10}
          columns={tableColumn}
          className="-striped -highlight"
          SubComponent={row => {
            return (
              <div>    
                {getEachTransaction(row).map((transaction) => {
                  return <div className="container">
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 col-lg-8 col-md-8">
                        <strong>Transaction Date:</strong> {transaction} - <strong>$</strong>{transaction.transactionAmount} - <strong>Points: </strong>{transaction.points}
                      </div>
                    </div>

                  </div>
                })}                                    
              </div>
            )
          }}
        />             
      </div>
    </div>
    <div className="container">    
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
          <h4>Total Points Table Per Customer</h4>
        </div>
      </div>      
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
          <ReactTable
            data={transactionData.totalPointsPerCustomer}
            columns={totalsColumn}
            defaultPageSize={10}                
          />
        </div>
      </div>
    </div>      
  </div>
}

export default App;