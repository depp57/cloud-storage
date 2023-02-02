# What is Cloud-storage ?

A new file storage and delivery system, accessible from anywhere.
Easy to install and to manage for anyone, individual or companies.
With enhanced security, you own your data, you encrypt your data.

We want to put personal data back in their owner's hands.

## Who can benefit from it ?

| Individual                                                   | Companies                                                   |
| ------------------------------------------------------------ | ----------------------------------------------------------- |
| Easy to install at home                                      | Cloud-ready deployment                                      |
| Any device with disk can be plugged into the system          | Horizontal scalability by design                            |
| You own your data                                            | ...                                                         |
| End-to-end encryption for maximal security                   | ...                                                         |
| Dyn-DNS service + port forwarding setup wizard  ?            | N/A                                                         |

## Technical considerations

### Project organized in a Monorepo

- Nginx reverse proxy + loadbalancer
- Front-end located in `/web-client/`
- Back-end located in `/server/`
- common CI

### Technologies

