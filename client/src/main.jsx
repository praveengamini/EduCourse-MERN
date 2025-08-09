import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '../node_modules/react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import ScrollToTop from './utils/ScrollToTop';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <ScrollToTop />
        <App />
    </Provider>
  </BrowserRouter>
)
