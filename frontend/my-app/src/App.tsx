import React, { useState, useRef } from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Street } from './types/Street';
import { fetchStreets } from './services/streetService';
import { dismissStreet } from './services/dismissService';
import { Box, Button, Typography, Alert } from '@mui/material';
import styles from './App.module.css';

const App: React.FC = () => {
  const [streets, setStreets] = useState<Street[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // New error state
  const inputRef = useRef<HTMLInputElement | null>(null);
  const search1Ref = useRef<HTMLInputElement | null>(null);
  const search2Ref = useRef<HTMLInputElement | null>(null);
  const search3Ref = useRef<HTMLInputElement | null>(null);

  const streetColumns: MRT_ColumnDef<Street>[] = [
    { accessorKey: 'שם ראשי', header: 'שם ראשי' },
    { accessorKey: 'שם מישני', header: 'שם מישני' },
    { accessorKey: 'סוג', header: 'סוג' },
    { accessorKey: 'קוד', header: 'קוד' },
	{ accessorKey: 'שכונה', header: 'שכונה' },
	{ accessorKey: 'קבוצה', header: 'קבוצה' },
    {
      id: 'actions',
      header: 'פעולות',
      Cell: ({ row }) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => removeRow(row.original.id)}
        >
          מחק
        </Button>
      ),
    },
  ];
  
  const searchStreets = async () => {
   if (inputRef.current !== null && search1Ref.current !== null && search2Ref.current !== null && search3Ref.current !== null) {
      setLoading(true);
      setError(null); // Reset error before making a new request
      try {
        const data = await fetchStreets(inputRef.current.value, (search1Ref.current.checked ? 0 : (search2Ref.current.checked ? 1 : (search3Ref.current.checked ? 2 : 0))));
		let listStreets: Street[] = [];
		for (var i in data) {
			let street: Street = {} as Street;		
			street.id = data[i]["_id"];
			street['שם ראשי'] = data[i]._source['שם ראשי'];
			street['שם מישני'] = data[i]._source['שם מישני'];
			street['סוג'] = data[i]._source['סוג'];
			street['קוד'] = data[i]._source['קוד'];
			street['שכונה'] = data[i]._source['שכונה'];
			street['קבוצה'] = data[i]._source['קבוצה'];
			listStreets.push(street);
		}
		setStreets(listStreets);
      } catch (err) {
        setError('Failed to load streets. Please try again later.');
      } finally {
        setLoading(false);
      }
	}
  }

  const removeRow = async (streetId: string) => {
    setLoading(true);
    setError(null); // Reset error before making a new request
	try {
	  await dismissStreet(streetId);
	} catch (err) {
        setError('Failed to load streets. Please try again later.');
    } finally {
        setLoading(false);
		setStreets(streets.filter((street) => street.id !== streetId));
    }    
  };

  return (
    <Box className={styles.container}>
      <div className={styles.gridContainer}>
        {/* Left Section: Search input , radio button and search button */}
        <div className={styles.section}>
          <Typography className={styles.title}>חיפוש</Typography>

          {/* Search Input */}
		  <label htmlFor="search">ערך לחפש</label>
		  <br/>
          <input
            id="search"            
            className={styles.searchInput}
			ref={inputRef}
          />
		  <br/>
		  
		  <label htmlFor="option1">חיפוש בשדה שם ראשי בלבד</label>
		  <br/>
		  <input id="option1" type="radio"  name="searchOption" ref={search1Ref} />
		  <br/>
		  <label htmlFor="option2">חיפוש מדויק של לפחות מילה אחת מהביטוי</label>
		  <br/>
		  <input id="option2" type="radio"  name="searchOption" ref={search2Ref} />
		  <br/>
		  <label htmlFor="option3">חיפוש כל הביטוי</label>
		  <br/>
		  <input id="option3" type="radio"  name="searchOption" ref={search3Ref} />
		 <br/>
		<br/>		 
		  
		 <Button
          variant="contained"
          color="primary"
          onClick={() => searchStreets()}
         >
		   חפש
		 </Button>
          
        </div>

        {/* Right Section: Search Results */}
        <div className={styles.section}>
          <Typography className={styles.title}>תוצאות חיפוש</Typography>
          {/* Error Handling */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Loading State */}
          {loading ? (
            <Typography>Loading streets...</Typography>
          ) : (
            !error && (
              <MaterialReactTable                
                columns={streetColumns}
                data={streets}                
              />
            )
          )}
        </div>
      </div>
    </Box>
  );
};

export default App;
