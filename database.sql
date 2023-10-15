
CREATE TABLE dates (
  date_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  event_date DATE,
  event_type VARCHAR(255),
  mobile_number VARCHAR(20)
);