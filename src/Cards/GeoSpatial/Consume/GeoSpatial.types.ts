import {  IKeyValuePairAdapter, IConsumeCardProps } from '../../../Models/Constants';
export interface GeoSpatialProps extends IConsumeCardProps {
    adapter: IKeyValuePairAdapter; //it's saying that the type is IKey Value Pair 
    pollingIntervalMillis: number;
    // imageSrc: string; THE LINE AND THE NEXT WOULD BE NEEDED FOR WHEN A MAP IS GIVEN AND POSITIONING THE INFO ON THE MAP
    // imagePropertyPositions: Record<string, ImgPropertyPositions>; //property name and positions pairs
    //this export specifies the type for the properties that it inherits. The type for properties may defer depending on the purpose of the component
}

/*

 All together these are the properties GeoSpatial has:
  adapter: state changing function
  pollingIntervalMillis: how long to wait before new data is pulled
  properties: an array of the properties of digital twin you'll like to display. ex: [{'temp': 2, 'pressure': 0, 'long': -1}], properties = [temp, pressure, long]
  id: the id of the digital twin
  title?: title of base card 
  theme?: Theme;light, dark or explorer
  locale?: Locale; language
  localeStrings?: Record<string, any>; not sure 
  adapterAdditionalParameters?: Record<string, any>; add additional property that might be specific to the instance of GeoSpatial interface
  imageSrc
  imagePropertyPositions


 */