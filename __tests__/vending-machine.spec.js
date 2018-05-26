const VendingMachine = require('../src/vending-machine.js');
const ItemData = require('../__mocks__/item-data.json');

describe('Vending Machine', () => {
  let test;
  beforeEach(() => {
    test = {};
    test.machineChange = {
      '2.00': 5,
      '1.00': 4,
      '0.25': 8,
      '0.10': 5,
      '0.05': 5
    };

    test.refillKey = 'A1';
    test.refillAmount = 5;
    test.refillData = {
      key: test.refillKey,
      itemname: 'All dressed chips',
      price: 1.25,
      stock: 10
    };

    test.refillChange = {
      '0.05': 5,
      '0.10': 10,
      '0.25': 5,
      '1.00': 6,
      '2.00': 5
    };
    test.refillOutputData = {
      '0.05': 10,
      '0.10': 15,
      '0.25': 13,
      '1.00': 10,
      '2.00': 10
    };

    test.purchaseItemButton = 'A2';
    test.purchaseItemChange = {
      '0.25': 2,
      '1.00': 1
    };
    test.purchaseItemExtraChange = {
      '2.00': 1
    };

    test.purchaseItemReturn = { item: 'Sour Patch Kids', change: {} };
    test.purchaseItemExtraChangeReturn = {
      item: 'Sour Patch Kids',
      change: { '0.25': 2 }
    };

    test.itemData = JSON.parse(JSON.stringify(ItemData));
    test.subject = new VendingMachine(test.itemData, test.machineChange);
  });

  describe('When a user requests to see inventory', () => {
    it('Should display a list of the inventory with all item information', () => {
      const result = test.subject.printInventory();
      expect(result).toEqual(test.itemData);
    });
  });

  describe('When maintenance refills an item using the item key', () => {
    it('Should return an error if no item exists at that location', () => {
      const result = test.subject.refillInventory('C1', 5);
      expect(result).toEqual('No item exists at that key');
    });
    it('Should return feedback on the new inventory of that item if it exists.', () => {
      const result = test.subject.refillInventory(
        test.refillKey,
        test.refillAmount
      );
      expect(result).toEqual(test.refillData);
    });
  });

  describe('When maintenance refills change in the machine', () => {
    it('Should return feedback on the new change amount in the machine', () => {
      const result = test.subject.reSupplyChange(test.refillChange);
      expect(result).toEqual(test.refillOutputData);
    });
    it('Should return an error if they enter an invalid change amount', () => {
      const result = test.subject.reSupplyChange(10);
      expect(result).toEqual('That is an invalid change amount');
    });
  });

  describe('When a user enters exact change for their button selection', () => {
    it('Should return the item with no change', () => {
      const result = test.subject.dispenseInventory(
        test.purchaseItemButton,
        test.purchaseItemChange
      );
      expect(result).toEqual(test.purchaseItemReturn);
    });
  });
  describe('When a user enters insufficient funds for their button selection', () => {
    it('Should return an error and the entirety of their change back', () => {});
  });
  describe('When a user enters in more change than necessary for their button selection', () => {
    it('Should return the item', () => {
      const { item } = test.subject.dispenseInventory(
        test.purchaseItemButton,
        test.purchaseItemExtraChange
      );
      expect(item).toEqual(test.purchaseItemExtraChangeReturn.item);
    });
    it('Should return the change difference between what they entered and what they purchased', () => {
      const { change } = test.subject.dispenseInventory(
        test.purchaseItemButton,
        test.purchaseItemExtraChange
      );
      expect(change).toEqual(test.purchaseItemExtraChangeReturn.change);
    });
  });
  describe('When a user clicks an invalid button', () => {
    it('Should return an error and the entirety of their change back', () => {});
  });
  describe('When a user chooses an item that has no inventory', () => {
    it('Should return an error and the entirety of their change back', () => {});
  });
});
