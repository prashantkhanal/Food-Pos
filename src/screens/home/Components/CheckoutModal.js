import React from 'react';
import {Modal} from 'native-base';
import {Dimensions, StyleSheet} from 'react-native';

const CheckoutModal = ({isOpen, onClose, children}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} style={styles.modalContainer}>
      <Modal.Content style={styles.contentContainer} maxWidth={600}>
        <Modal.CloseButton />
        {children}
      </Modal.Content>
    </Modal>
  );
};

export default CheckoutModal;

const styles = StyleSheet.create({
  modalContainer: {
    height: Dimensions.get('window').height / 1.34,
    width: Dimensions.get('window').width / 1.435,
  },
  contentContainer: {
    height: 500,
    width: 1500,
  },
});
