import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Wind, Shield } from 'lucide-react';
import axios from 'axios';
import Lottie from "lottie-react";
import confettiAnimation from '../animations/Flex Confetti.json';
import statesAndCities from '../data/states-and-cities.json';
import { API_URL } from '../config';

const safeApiUrl = API_URL;

type Person = {
  name: string;
  age: string;
  relation: string;
  occupation: string;
  phone: string;
  email: string;
  city: string;
  state: string;
};

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const packageData = location.state?.packageData;
  const from = location.state?.from;
  const packageId = packageData?.id || packageData?._id;

  const [personCount, setPersonCount] = useState(1);
  const [isMember, setIsMember] = useState(false);
  const [membershipId, setMembershipId] = useState('');
  const [date, setDate] = useState('');
  const [personDetails, setPersonDetails] = useState<Person[]>([{
    name: '',
    age: '',
    relation: 'friend',
    occupation: '',
    phone: '',
    email: '',
    city: '',
    state: ''
  }]);
  const [healthDetails, setHealthDetails] = useState({
    heartConditions: 'no',
    respiratoryIssues: 'no',
    pastInjuries: 'no',
    otherConcerns: ''
  });
  const [bikeDetails, setBikeDetails] = useState({
    type: 'naked',
    name: '',
    cc: '',
    experience: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [arrivalPlace, setArrivalPlace] = useState('');
  const [pickupNeeded, setPickupNeeded] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [validationEmail, setValidationEmail] = useState('');
  const [isMembershipValid, setIsMembershipValid] = useState(false);
  const [membershipError, setMembershipError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidationLoading, setIsValidationLoading] = useState(false);

  const [popupMessage, setPopupMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[][]>([]);

  useEffect(() => {
    setStates(Object.keys(statesAndCities));
  }, []);

  useEffect(() => {
    const newCities = personDetails.map(person => {
      if (person.state) {
        return statesAndCities[person.state as keyof typeof statesAndCities] || [];
      }
      return [];
    });
    setCities(newCities);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (packageData && packageData.price) {
      const priceString = String(packageData.price).replace(/[^0-9]/g, '');
      const price = parseInt(priceString, 10);
      setBasePrice(price);
      let amount = price * personCount;
      if (isMember && isMembershipValid) {
        // Apply 10% discount for members
        amount *= 0.9;
      }
      setFinalAmount(amount);
    }
  }, [personCount, isMember, isMembershipValid, packageData]);

  useEffect(() => {
    const newPersonDetails = [...personDetails];
    const firstPersonRelation = newPersonDetails[0]?.relation;

    if (personCount > newPersonDetails.length) {
      for (let i = newPersonDetails.length; i < personCount; i++) {
        newPersonDetails.push({
          name: '',
          age: '',
          relation: firstPersonRelation !== 'friend' ? firstPersonRelation : 'friend',
          occupation: '',
          phone: '',
          email: '',
          city: newPersonDetails[0]?.city || '',
          state: newPersonDetails[0]?.state || ''
        });
      }
    } else if (personCount < newPersonDetails.length) {
      newPersonDetails.length = personCount;
    }
    setPersonDetails(newPersonDetails);
  }, [personCount]);

  useEffect(() => {
    if (personDetails.length > 0 && personDetails[0] && personDetails[0].email) {
      setValidationEmail(personDetails[0].email);
    }
  }, [personDetails]);

  useEffect(() => {
    return () => {
      setIsMember(false);
      setMembershipId('');
    };
  }, []);

  useEffect(() => {
    if (personDetails.length > 1 && personDetails[0]) {
      const firstPersonRelation = personDetails[0].relation;
      if (firstPersonRelation !== 'friend') {
        const newPersonDetails = personDetails.map((person, index) => {
          if (index > 0) {
            return { ...person, relation: firstPersonRelation };
          }
          return person;
        });
        setPersonDetails(newPersonDetails);
      }
    }
  }, []);

  // Redirect to home if packageData is missing
  useEffect(() => {
    if (!packageData) {
      navigate('/');
    }
  }, [packageData, navigate]);

  if (!packageData) return null;

  const handlePersonDetailChange = (index: number, field: keyof Person, value: string) => {
    const newPersonDetails = [...personDetails];
    newPersonDetails[index][field] = value;
    setPersonDetails(newPersonDetails);
  };

  const handleHealthDetailChange = (field: string, value: string) => {
    setHealthDetails({ ...healthDetails, [field]: value });
  };

  const handleBikeDetailChange = (field: string, value: string) => {
    setBikeDetails({ ...bikeDetails, [field]: value });
  };

  const handleMembershipValidation = async () => {
    if (!validationEmail || !membershipId) {
      setMembershipError('Please enter both email and membership ID.');
      return;
    }

    setIsValidationLoading(true);
    setMembershipError('');

    try {
      const response = await axios.post(`${safeApiUrl}/api/validate-membership`, {
        email: validationEmail,
        membershipId: membershipId,
      });

      if (response.data.isValid) {
        setIsMembershipValid(true);
        setMembershipError('');
        alert('Membership validated successfully!');
      } else {
        setIsMembershipValid(false);
        setMembershipError(response.data.message || 'Invalid membership ID or email.');
      }
    } catch (error) {
      setIsMembershipValid(false);
      setMembershipError('Failed to validate membership. Please try again.');
      console.error('Membership validation failed:', error);
    } finally {
      setIsValidationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (const person of personDetails) {
      if (!person.name || !person.age || !person.relation || !person.occupation || !person.phone || !person.email || !person.city || !person.state) {
        alert('Please fill out all person details.');
        return;
      }
    }

    if (packageData.trekDuration) {
      if (healthDetails.heartConditions === 'yes' || healthDetails.respiratoryIssues === 'yes' || healthDetails.pastInjuries === 'yes') {
        if (!healthDetails.otherConcerns) {
          alert('Please provide details about your health conditions.');
          return;
        }
      }
    }

    if (packageData.duration) {
      if (!bikeDetails.name || !bikeDetails.cc || !bikeDetails.experience) {
        alert('Please fill out all bike details.');
        return;
      }
    }

    if (!arrivalPlace) {
      alert('Please enter your arriving place.');
      return;
    }

    if (!termsAccepted) {
      alert('Please accept the terms and conditions.');
      return;
    }

    if (isMember && !isMembershipValid) {
      alert('Please validate your membership before booking.');
      return;
    }

    setIsLoading(true);

    let bookingType = 'tour';
    if (packageData.duration) {
      bookingType = 'bike';
    } else if (packageData.trekDuration) {
      bookingType = 'trek';
    }

    const bookingData = {
      bookingType,
      packageId,
      packageTitle: packageData.title,
      personCount,
      date,
      personDetails,
      arrivalPlace,
      pickupNeeded,
      isMember,
      membershipId,
      finalAmount,
      healthDetails: bookingType === 'trek' ? healthDetails : undefined,
      bikeDetails: bookingType === 'bike' ? bikeDetails : undefined,
    };

    try {
      const response = await axios.post(`${safeApiUrl}/api/v2/booking`, bookingData);
      setPopupMessage('Booking confirmed! We have sent you an email with the details.');
      setShowCelebration(true);

      console.log(response.data.message);

      // Reset form state
      setPersonCount(1);
      setIsMember(false);
      setMembershipId('');
      setDate('');
      setPersonDetails([{
        name: '',
        age: '',
        relation: 'friend',
        occupation: '',
        phone: '',
        email: '',
        city: '',
        state: ''
      }]);
      setHealthDetails({
        heartConditions: 'no',
        respiratoryIssues: 'no',
        pastInjuries: 'no',
        otherConcerns: ''
      });
      setBikeDetails({
        type: 'naked',
        name: '',
        cc: '',
        experience: ''
      });
      setTermsAccepted(false);
      setArrivalPlace('');
      setPickupNeeded(false);
      setIsMembershipValid(false);
      setValidationEmail('');
      setMembershipError('');


      if (pickupNeeded) {
        const adminEmailData = {
          ...bookingData,
          subject: 'Pickup Request for Booking',
          recipient: 'your-admin-email@example.com', // Replace with the actual admin email
        };
        await axios.post(`${safeApiUrl}/api/v2/send-admin-email`, adminEmailData);
        console.log('Admin email sent for pickup request.');
      }
    } catch (error) {
      let errorMsg = 'Booking failed. Please try again.';
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.error) {
        errorMsg = error.response.data.error;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      console.error('Booking failed:', error);
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[60]">
          <div className="text-white text-2xl font-bold">Processing...</div>
        </div>
      )}

      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col justify-center items-center z-[60]">
          <Lottie
            animationData={confettiAnimation}
            loop={false}
            autoplay={true}
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          />
          <div className="relative p-8 rounded-lg shadow-2xl text-center max-w-sm mx-4 z-10">
            <h2 className="text-3xl font-bold text-emerald-600 mb-4">Booking Confirmed!</h2>
            <p className="text-white text-lg mb-6">{popupMessage}</p>
            <Link to="/" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
              Go to Home
            </Link>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="personCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Persons
                </label>
                <input
                  type="number"
                  id="personCount"
                  min="1"
                  value={personCount}
                  onChange={(e) => setPersonCount(parseInt(e.target.value))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Confirmation
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4">Person Details</h2>
            {personDetails.map((person, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg">
                <input
                  type="text"
                  placeholder={`Person ${index + 1} Name`}
                  value={person.name}
                  onChange={(e) => handlePersonDetailChange(index, 'name', e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={person.age}
                  onChange={(e) => handlePersonDetailChange(index, 'age', e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={person.relation}
                  onChange={(e) => handlePersonDetailChange(index, 'relation', e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  disabled={index > 0 && personDetails[0].relation !== 'friend'}
                >
                  <option value="friend">Friend</option>
                  <option value="couple">Couple</option>
                  <option value="colleague">Colleague</option>
                  <option value="family">Family</option>
                </select>
                <input
                  type="text"
                  placeholder="Occupation"
                  value={person.occupation}
                  onChange={(e) => handlePersonDetailChange(index, 'occupation', e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={person.phone}
                  onChange={(e) => handlePersonDetailChange(index, 'phone', e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={person.email}
                  onChange={(e) => handlePersonDetailChange(index, 'email', e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={person.state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    handlePersonDetailChange(index, 'state', newState);
                    const newCities = statesAndCities[newState as keyof typeof statesAndCities] || [];
                    const updatedCities = [...cities];
                    updatedCities[index] = newCities;
                    setCities(updatedCities);
                    handlePersonDetailChange(index, 'city', newCities[0] || '');
                  }}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <select
                  value={person.city}
                  onChange={(e) => handlePersonDetailChange(index, 'city', e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select City</option>
                  {cities[index] && cities[index].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            ))}

            {packageData.duration && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Bike Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg">
                  <select
                    value={bikeDetails.type}
                    onChange={(e) => handleBikeDetailChange('type', e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="naked">Naked</option>
                    <option value="sport">Sport</option>
                    <option value="adventure">Adventure</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Bike Name"
                    value={bikeDetails.name}
                    onChange={(e) => handleBikeDetailChange('name', e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Bike CC"
                    value={bikeDetails.cc}
                    onChange={(e) => handleBikeDetailChange('cc', e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="mb-4 p-4 border rounded-lg">
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Previous Riding Experience</label>
                  <textarea
                    id="experience"
                    rows={3}
                    value={bikeDetails.experience}
                    onChange={(e) => handleBikeDetailChange('experience', e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>
              </>
            )}

            {packageData.trekDuration && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Health Declaration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 border rounded-lg">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    <label htmlFor="heartConditions" className="block text-sm font-medium text-gray-700">Do you have any heart conditions?</label>
                    <select
                      id="heartConditions"
                      value={healthDetails.heartConditions}
                      onChange={(e) => handleHealthDetailChange('heartConditions', e.target.value)}
                      required
                      className="ml-4 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <Wind className="h-5 w-5 mr-2 text-blue-500" />
                    <label htmlFor="respiratoryIssues" className="block text-sm font-medium text-gray-700">Do you have any respiratory issues?</label>
                    <select
                      id="respiratoryIssues"
                      value={healthDetails.respiratoryIssues}
                      onChange={(e) => handleHealthDetailChange('respiratoryIssues', e.target.value)}
                      required
                      className="ml-4 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-gray-500" />
                    <label htmlFor="pastInjuries" className="block text-sm font-medium text-gray-700">Any past injuries that might affect your trek?</label>
                    <select
                      id="pastInjuries"
                      value={healthDetails.pastInjuries}
                      onChange={(e) => handleHealthDetailChange('pastInjuries', e.target.value)}
                      required
                      className="ml-4 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="otherConcerns" className="block text-sm font-medium text-gray-700 mb-1">Please list any other health concerns</label>
                    <textarea
                      id="otherConcerns"
                      rows={3}
                      value={healthDetails.otherConcerns}
                      onChange={(e) => handleHealthDetailChange('otherConcerns', e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                    ></textarea>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="arrivalPlace" className="block text-sm font-medium text-gray-700 mb-1">
                  Arriving Place
                </label>
                <input
                  type="text"
                  id="arrivalPlace"
                  value={arrivalPlace}
                  onChange={(e) => setArrivalPlace(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pickupNeeded"
                  checked={pickupNeeded}
                  onChange={(e) => setPickupNeeded(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="pickupNeeded" className="ml-2 block text-sm text-gray-900">
                  Pickup Needed?
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isMember"
                  checked={isMember}
                  onChange={(e) => setIsMember(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="isMember" className="ml-2 block text-sm text-gray-900">
                  Are you a WeTrek India member?
                </label>
              </div>
              {isMember && (
                <div className="mt-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="validationEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="validationEmail"
                        value={validationEmail}
                        onChange={(e) => setValidationEmail(e.target.value)}
                        required
                        disabled={isMembershipValid}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="membershipId" className="block text-sm font-medium text-gray-700 mb-1">
                        Membership ID
                      </label>
                      <input
                        type="text"
                        id="membershipId"
                        value={membershipId}
                        onChange={(e) => setMembershipId(e.target.value)}
                        required
                        disabled={isMembershipValid}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleMembershipValidation}
                    disabled={isMembershipValid || isValidationLoading}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors duration-200 disabled:bg-gray-400"
                  >
                    {isValidationLoading ? 'Validating...' : (isMembershipValid ? 'Validated' : 'Validate Membership')}
                  </button>
                  {membershipError && (
                    <p className="mt-2 text-sm text-red-600">{membershipError}</p>
                  )}
                  {isMembershipValid && (
                    <p className="mt-2 text-sm text-green-600">Membership validated successfully!</p>
                  )}
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <h3 className="font-semibold text-emerald-800 mb-2 flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" /> Membership Benefits
                    </h3>
                    <ul className="list-disc pl-5 text-emerald-700 text-sm">
                      <li>10% discount on this booking</li>
                      <li>Priority support</li>
                      <li>Exclusive merchandise</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">
                  I have read and agree to the <a href="/terms" target="_blank" className="text-emerald-600 hover:underline">terms and conditions</a>.
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              Confirm Booking
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Package:</span>
              <span className="font-semibold text-gray-900">{packageData.title}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Persons:</span>
              <span className="font-semibold text-gray-900">{personCount}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Base Price:</span>
              <span className="font-semibold text-gray-900">₹{basePrice}</span>
            </div>
            {isMember && isMembershipValid && (
              <div className="flex justify-between items-center mb-4 text-emerald-600">
                <span className="text-gray-700">Membership Discount (10%):</span>
                <span className="font-semibold">- ₹{(basePrice * personCount * 0.1).toFixed(2)}</span>
              </div>
            )}
            <hr className="my-4" />
            <div className="flex justify-between items-center text-xl font-bold">
              <span className="text-gray-900">Final Amount:</span>
              <span className="text-emerald-600">₹{finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;