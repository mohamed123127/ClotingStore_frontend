
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import React from 'react'

/** ---------- Types ---------- */
export type SaledItem = {
  product: string
  color: string
  size: string
  selling_price: string
  quantity: number
}

export type Sale = {
  id: string
  fullName: string
  status: string
  communeAndWillaya: string
  ['agence/address']: string
  phoneNumber: string
  totalPrice: number
  ['updated at']: string
  saledItems: SaledItem[]
}

/** ---------- Row Component ---------- */
function Row({ row }: { row: Sale }) {
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.fullName}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>{row.communeAndWillaya}</TableCell>
        <TableCell>{row['agence/address']}</TableCell>
        <TableCell>{row.phoneNumber}</TableCell>
        <TableCell align="right">{row.totalPrice} DA</TableCell>
        <TableCell>{new Date(row['updated at']).toLocaleString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Détails des articles
              </Typography>
              <Table size="small" aria-label="saled-items">
                <TableHead>
                  <TableRow>
                    <TableCell>Produit</TableCell>
                    <TableCell>Couleur</TableCell>
                    <TableCell>Taille</TableCell>
                    <TableCell align="right">Prix de vente</TableCell>
                    <TableCell align="right">Quantité</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.saledItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{item.color}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell align="right">{item.selling_price} DA</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

/** ---------- Main Table Component ---------- */
export function SalesTable({ sales }: { sales: Sale[] }) {
  return (
    <TableContainer component={Paper} lang="en" dir="ltr">
      <Table aria-label="sales table" lang="en" dir="ltr">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Commune/Wilaya</TableCell>
            <TableCell>Agence/Adresse</TableCell>
            <TableCell>Téléphone</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Dernière maj</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.map((sale) => (
            <Row key={sale.id} row={sale} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
