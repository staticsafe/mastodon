import React from 'react';
import PropTypes from 'prop-types';
import TransitionMotion from 'react-motion/lib/TransitionMotion';
import spring from 'react-motion/lib/spring';
import BundleContainer from '../containers/bundle_container';
import BundleModalError from './bundle_modal_error';
import ModalLoading from './modal_loading';
import {
  MediaModal,
  OnboardingModal,
  VideoModal,
  BoostModal,
  ConfirmationModal,
  ReportModal,
} from '../../../features/ui/util/async-components';

const MODAL_COMPONENTS = {
  'MEDIA': MediaModal,
  'ONBOARDING': OnboardingModal,
  'VIDEO': VideoModal,
  'BOOST': BoostModal,
  'CONFIRM': ConfirmationModal,
  'REPORT': ReportModal,
};

export default class ModalRoot extends React.PureComponent {

  static propTypes = {
    type: PropTypes.string,
    props: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  };

  handleKeyUp = (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27)
         && !!this.props.type) {
      this.props.onClose();
    }
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyUp, false);
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  willEnter () {
    return { opacity: 0, scale: 0.98 };
  }

  willLeave () {
    return { opacity: spring(0), scale: spring(0.98) };
  }

  renderModal = (SpecificComponent) => {
    const { props, onClose } = this.props;

    return <SpecificComponent {...props} onClose={onClose} />;
  }

  renderLoading = () => {
    return <ModalLoading />;
  }

  renderError = (props) => {
    const { onClose } = this.props;

    return <BundleModalError {...props} onClose={onClose} />;
  }

  render () {
    const { type, props, onClose } = this.props;
    const visible = !!type;
    const items = [];

    if (visible) {
      items.push({
        key: type,
        data: { type, props },
        style: { opacity: spring(1), scale: spring(1, { stiffness: 120, damping: 14 }) },
      });
    }

    return (
      <TransitionMotion
        styles={items}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {interpolatedStyles =>
          <div className='modal-root'>
            {interpolatedStyles.map(({ key, data: { type }, style }) => (
              <div key={key} style={{ pointerEvents: visible ? 'auto' : 'none' }}>
                <div role='presentation' className='modal-root__overlay' style={{ opacity: style.opacity }} onClick={onClose} />
                <div className='modal-root__container' style={{ opacity: style.opacity, transform: `translateZ(0px) scale(${style.scale})` }}>
                  <BundleContainer fetchComponent={MODAL_COMPONENTS[type]} loading={this.renderLoading} error={this.renderError} renderDelay={200}>{this.renderModal}</BundleContainer>
                </div>
              </div>
            ))}
          </div>
        }
      </TransitionMotion>
    );
  }

}
