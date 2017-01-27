import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import BarSearch from '../components/BarSearch.jsx';


const HomePage = () => (
  <Card className="container">
    <CardTitle title="React Application" subtitle="This is the home page." />
    <BarSearch />
  </Card>
);

export default HomePage;