import mongoose from 'mongoose';
import config from './config';
import dummyData from './dummyData';

export default function(done) {
   mongoose.connect(config.mongoURL, (error) => {
      if (error) {
         console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
         throw error;
      }

      dummyData();
   });
	done();
}
