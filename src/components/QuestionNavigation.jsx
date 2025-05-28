import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function QuestionNavigation({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(null, currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(null, currentPage + 1);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      width: '100%', 
      mt: 2, 
      mb: 2 
    }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handlePrevious}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      
      <Button
        variant="outlined"
        endIcon={<ArrowForwardIcon />}
        onClick={handleNext}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </Box>
  );
}

export default QuestionNavigation;