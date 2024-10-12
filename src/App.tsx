import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import SandpackEditor from './SandpackEditor';
import Chat from './Chat';
import { TemplateProvider } from './TemplateContext';
import TemplateSelector from './TemplateSelector';

const theme = createTheme();

function App() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TemplateProvider>
        <Box sx={{
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh'
        }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                ChatGround
              </Typography>
              <TemplateSelector />
            </Toolbar>
          </AppBar>
          <Container maxWidth={false} sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: isMobile ? 'auto' : 'hidden', 
            py: 2 
          }}>
            <Grid container spacing={2} sx={{ flexGrow: 1, height: '100%' }}>
              <Grid item xs={12} md={4} lg={3} sx={{ height: isMobile ? 'auto' : '100%', minHeight: isMobile ? '300px' : 'auto' }}>
                <Chat />
              </Grid>
              <Grid item xs={12} md={8} lg={9} sx={{ height: '100%' }}>
                <SandpackEditor />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </TemplateProvider>
    </ThemeProvider>
  );
}

export default App;
