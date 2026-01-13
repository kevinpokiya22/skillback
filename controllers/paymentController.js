const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Course = require('../models/Course');
const Order = require('../models/Order');

exports.createPaymentIntent = async (req, res) => {
  const { courseId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 100), // Stripe expects cents
      currency: 'usd',
      metadata: { courseId: course._id.toString(), userId: req.user._id.toString() },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  const { paymentIntentId, courseId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === 'succeeded') {
      const order = await Order.create({
        userId: req.user._id,
        courseId,
        amount: paymentIntent.amount / 100,
        paymentStatus: 'completed',
        paymentId: paymentIntentId,
      });

      // Add course to user's enrolledCourses
      req.user.enrolledCourses.push(courseId);
      await req.user.save();

      res.json({ message: 'Payment successful', order });
    } else {
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
