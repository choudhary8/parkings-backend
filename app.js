require( './data/init')

const express = require( 'express' );
const morgan = require( 'morgan');
const cors = require( 'cors' );

const userRouter = require( './routes/user' )
const app = express();

app.use( morgan( ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"' ) );
app.use( express.json() );
app.use( cors() );
app.use( express.urlencoded( { extended: false } ) )



app.use( '', userRouter );

app.listen( 3000, ( error ) => {
    if( error ) {
        return console.log( error.message );
    }

    console.log( 'server started on http://localhost:3000' );
})