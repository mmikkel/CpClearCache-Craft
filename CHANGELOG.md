# CP Clear Cache Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## 1.3.0 - 2022-11-10
### Fixed
- Fixed an issue where CP Clear Cache wouldn't work properly if the Control Panel Navigation was installed  

## 1.2.1 - 2022-05-07
### Changed
- CP Clear Cache now defers any element queries to the `craft\web\Application::EVENT_INIT` event, avoiding potential issues with element queries being executed before Craft has fully initialised.  

## 1.2.0 - 2022-03-23

### Added
- Added Craft 4.0 compatibility

### Changed
- CP Clear Cache now requires Craft 3.7.x
- Updated plugin icon

## 1.1.0 - 2021-01-21  

### Fixed  
- Fixes an issue where CP Clear Cache would disable submit buttons in the Utilities section inside Craft's Control Panel  

### Changed  
- CP Clear Cache now requires Craft 3.5.0+  

## 1.0.7 - 2020-07-31  

### Improved  

- Improved Craft 3.5 compatibility  

## 1.0.6 - 2020-02-02  

### Improved  

- Improves Craft 3.4 compatibility  

## 1.0.5 - 2019-10-21  

### Fixed  

- Fixes an issue where CP Clear Cache could conflict with other plugins  

## 1.0.4 - 2019-03-27  

### Fixed  

- Fixes an issue where CP Clear Cache could conflict with other plugins  

## 1.0.3 - 2018-11-23  

### Improved  

– Improves plugin tagline (thanks Brandon!)  

## 1.0.2 - 2018-05-16  

### Added  

– CP Clear Cache now remembers your checked boxes  

### Fixed  

- Fixes the missing nav item icon on Craft 3.0.7 and above  

## 1.0.1 - 2018-03-28  

### Fixed  

- Fixes issue #1, where CP Clear Cache would conflict w/ other plugins (e.g. SEOmatic)  

## 1.0.0 - 2018-03-06  

### Added  

- Initial release  
