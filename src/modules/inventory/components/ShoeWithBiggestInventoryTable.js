import PropTypes from 'prop-types';
import React from 'react';
import take from 'lodash/take';
import { connect } from 'react-redux';
import { biggestShoeInventorySelector } from '../state/inventorySelectors';
import Table from '../../app/components/Table';
import TableHeader from '../../app/components/TableHeader';
import TableRow from '../../app/components/TableRow';
import TableCell from '../../app/components/TableCell';
import ShoeLink from '../../shoe/components/ShoeLink';
import Empty from '../../app/components/Empty';

function ShoeWithBiggestInventoryTable(props) {
  const { inventory, limit } = props;

  if (!inventory.length) {
    return <Empty>No shoe found</Empty>;
  }

  return (
    <Table>
      <TableRow>
        <TableHeader>Shoe</TableHeader>
        <TableHeader>Quantity</TableHeader>
      </TableRow>
      {(limit ? take(inventory, limit) : inventory).map(
        ({ shoeId, quantity }) => (
          <TableRow key={shoeId}>
            <TableCell>
              <ShoeLink shoeId={shoeId} />
            </TableCell>
            <TableCell>{quantity}</TableCell>
          </TableRow>
        ),
      )}
    </Table>
  );
}

ShoeWithBiggestInventoryTable.defaultProps = {
  limit: null,
};

ShoeWithBiggestInventoryTable.propTypes = {
  inventory: PropTypes.array.isRequired,
  limit: PropTypes.number,
};

const mapState = state => ({
  inventory: biggestShoeInventorySelector(state),
});

export default connect(mapState)(ShoeWithBiggestInventoryTable);
