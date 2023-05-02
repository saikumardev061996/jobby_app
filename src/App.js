import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from './Components/Login'
import Home from './Components/Home'
import NotFound from './Components/NotFound'
import JobRoute from './Components/JobRoute'
import ProtectedRoute from './Components/ProtectRoute'
import JobItemDetails from './Components/JobItemDetails'

import './App.css'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/jobs" component={JobRoute} />
      <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default App
