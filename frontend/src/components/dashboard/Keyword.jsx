import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import { CircularProgress } from '@mui/material';
import axios from 'axios';

const Keyword = ({ data }) => {
    // const wordCloudData = data.keywords.map(item => ({ text: item.word, value: item.score }));
    const [loading, setLoading] = React.useState(true);
    const [wordCloudData, setWordCloudData] = React.useState([]);

    React.useEffect(() => {
        // if (data.keywords) {
        //     const wordCloudData = data.keywords.map(item => ({ text: item.word, value: item.score }));
        //     setWordCloudData(wordCloudData);
        //     setLoading(false);
        // }
        const fetchData = async () => {
          await axios
            .get("http://127.0.0.1:5000/kextract")
            .then((res) => {
              console.log(res.data);
                const wordCloudData = res.data.map((item) => ({
                    text: item.word,
                    value: item.score,
                }));
                setWordCloudData(wordCloudData);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
            });
        };
        fetchData();
    }, [data]);

    const options = {
        rotations: 0,
        rotationAngles: [0],
        fontFamily: 'Roboto, sans-serif',
        fontSizes: [20, 60],
        fontStyle: 'normal',
        fontWeight: 'normal',
        padding: 1,
        scale: 'sqrt',
        spiral: 'archimedean',
        transitionDuration: 1000
    };
    
    return (
      <>
      {loading ?
            <CircularProgress /> 
        : (
        <div style={{ width: "450px", height: "250px" }}>
          <ReactWordcloud words={wordCloudData} options={options} />
        </div>
        )}
      </>
    );
}

export default Keyword;