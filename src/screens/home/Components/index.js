import React from 'react';
import {Modal} from 'native-base';
import {Dimensions, StyleSheet} from 'react-native';

const ModalComp = ({isOpen, onClose, children}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} style={styles.modalContainer}>
      <Modal.Content style={styles.contentContainer} maxWidth={600}>
        <Modal.CloseButton />
        {children}
      </Modal.Content>
    </Modal>
  );
};

export default ModalComp;

const styles = StyleSheet.create({
  contentContainer: {
    height: 500,
    width: 1500,
  },
});
