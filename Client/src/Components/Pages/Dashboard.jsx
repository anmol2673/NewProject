import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Design/dashboard.css';

const Dashboard = () => {
  const [savedWriteTopics, setSavedWriteTopics] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTotalItems();
  }, []);

  useEffect(() => {
    fetchSavedWriteTopics();
  }, [currentPage]);

  const fetchTotalItems = async () => {
    try {
      const response = await axios.get("http://localhost:9000/saved-writetopics");
      setTotalItems(response.data.length);
    } catch (error) {
      console.error('Error fetching total items:', error);
    }
  };

  const fetchSavedWriteTopics = async () => {
    try {
      const response = await axios.get("http://localhost:9000/saved-writetopics", {
        params: {
          _page: currentPage,
          _limit: itemsPerPage,
        },
      });
      setSavedWriteTopics(response.data);
    } catch (error) {
      console.error('Error fetching saved write topics:', error);
    }
  };

  const handleEdit = (id) => {
    console.log(`Editing recent search with id ${id}`);
  };

  const handleView = (id) => {
    console.log(`Viewing recent search with id ${id}`);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className='dashboard-container'>
      <div className='generate'>
        <button id='generate-btn'>Generate New Article</button>
      </div>
      <div>
        <table>
          <thead>
          
          </thead>
          <tbody>
            {savedWriteTopics.map((writeTopic) => (
              <tr key={writeTopic.id}>
                <td>{writeTopic.writeTopic}</td>
                <td>
                  <button onClick={() => handleEdit(writeTopic.id)}>Edit</button>
                  <button onClick={() => handleView(writeTopic.id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='pagination'>
        <button onClick={() => changePage(1)} disabled={currentPage === 1}>First</button>
        <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        <button onClick={() => changePage(totalPages)} disabled={currentPage === totalPages}>Last</button>
      </div>
    </div>
  );
};

export default Dashboard;
