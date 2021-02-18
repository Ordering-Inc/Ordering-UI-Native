import React from 'react';
import {BusinessList as BusinessListController} from 'ordering-components/native';
import {BusinessListWrapper} from './styles';
import {BusinessController} from '../BusinessController';

const businessInfoDummy = {
  hidden: ['original', 'api', 'hidden'],
  original: {
    id: 24,
    name: 'Crops Grocery',
    header:
      'https://res.cloudinary.com/ordering2/image/upload/v1562276183/mypri0lenw5cprrutbrv.png',
    logo:
      'https://res.cloudinary.com/ordering2/image/upload/v1562276189/heyisftur11ekptvv53n.jpg',
    location: {lat: 40.72327750000001, lng: -74.0045336, zipcode: -1, zoom: 15},
    schedule: [
      {
        enabled: true,
        lapses: [{open: {hour: 0, minute: 0}, close: {hour: 23, minute: 59}}],
      },
      {
        enabled: true,
        lapses: [{open: {hour: 0, minute: 0}, close: {hour: 23, minute: 59}}],
      },
      {
        enabled: true,
        lapses: [{open: {hour: 0, minute: 0}, close: {hour: 23, minute: 59}}],
      },
      {
        enabled: true,
        lapses: [{open: {hour: 0, minute: 0}, close: {hour: 23, minute: 59}}],
      },
      {
        enabled: true,
        lapses: [{open: {hour: 0, minute: 0}, close: {hour: 23, minute: 59}}],
      },
      {
        enabled: true,
        lapses: [{open: {hour: 0, minute: 0}, close: {hour: 23, minute: 59}}],
      },
      {
        enabled: true,
        lapses: [{open: {hour: 0, minute: 0}, close: {hour: 23, minute: 59}}],
      },
    ],
    delivery_price: 2,
    delivery_time: '1:0',
    pickup_time: '1:5',
    featured: false,
    food: false,
    laundry: false,
    alcohol: false,
    groceries: true,
    slug: 'cropsgrocery',
    timezone: 'America/New_York',
    menus_count: 1,
    available_menus_count: 1,
    open: true,
    today: {
      enabled: true,
      lapses: [{open: {hour: 0, minute: 0}, close: {hour: 23, minute: 59}}],
    },
    reviews: {
      reviews: [
        {
          id: 13,
          order_id: 15,
          quality: 5,
          delivery: 5,
          service: 4,
          package: 2,
          comment: 'Nice service',
          enabled: true,
          created_at: '2019-07-08 20:08:29',
          updated_at: '2019-07-08 20:08:29',
          laravel_through_key: 24,
          total: 4,
        },
      ],
      quality: 5,
      delivery: 5,
      service: 4,
      package: 2,
      total: 4,
    },
    distance: 1.1729364492824264,
    delivery_zone: 13,
    minimum: 1,
    offers: [],
  },
  api: {
    attributes: [
      'id',
      'name',
      'header',
      'logo',
      'location',
      'schedule',
      'open',
      'delivery_price',
      'distance',
      'delivery_time',
      'pickup_time',
      'reviews',
      'featured',
      'offers',
      'food',
      'laundry',
      'alcohol',
      'groceries',
      'slug',
    ],
    query: {
      location: '40.71310872505757,-74.00823658440856',
      type: 1,
      page: 1,
      page_size: 10,
    },
    ordering: {
      url: 'https://apiv4-dev.ordering.co',
      version: 'v400',
      project: 'luisv4',
      language: 'en',
      accessToken:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGl2NC1kZXYub3JkZXJpbmcuY29cL3Y0MDBcL2VuXC9sdWlzdjRcL2F1dGgiLCJpYXQiOjE2MTM2MDg3NTgsImV4cCI6MTY0NTE0NDc1OCwibmJmIjoxNjEzNjA4NzU4LCJqdGkiOiJWT3J5UlNPVHlxc3dsam5zIiwic3ViIjoyLCJsZXZlbCI6M30.6HjR9sI3XjFycPe68RBS4J3raXq7mWS8tSvpxrlonsc',
      apiKey: null,
      appId: 'ordering-react',
    },
  },
  id: 24,
  name: 'Crops Grocery',
  header:
    'https://res.cloudinary.com/ordering2/image/upload/v1562276183/mypri0lenw5cprrutbrv.png',
  logo:
    'https://res.cloudinary.com/ordering2/image/upload/v1562276189/heyisftur11ekptvv53n.jpg',
  delivery_price: 2,
  delivery_time: '1:0',
  pickup_time: '1:5',
  featured: false,
  food: false,
  laundry: false,
  alcohol: false,
  groceries: true,
  slug: 'cropsgrocery',
  timezone: 'America/New_York',
  menus_count: 1,
  available_menus_count: 1,
  open: true,
  distance: 1.1729364492824264,
  delivery_zone: 13,
  minimum: 1,
};

const BusinessesListingUI = (props: any) => {
  return (
    <BusinessListWrapper>
      <BusinessController business={businessInfoDummy} />
    </BusinessListWrapper>
  );
};

export const BusinessesListing = (props: any) => {
  const businessListingProps = {
    ...props,
    UIComponent: BusinessesListingUI,
  };

  return <BusinessListController {...businessListingProps} />;
};
