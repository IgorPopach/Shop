import React from 'react';
import { useDispatch } from 'react-redux';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
// import { createSwitchNavigator } from 'react-navigation-switch';
import { Platform, SafeAreaView, Button, View } from 'react-native';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../store/actions/auth';

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen,
  },
  {
    navigationOptions: {
      drawerIcon: drawerConf => <Ionicons
        name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
        size={23}
        color={drawerConf.tintColor}
      />
    },
    defaultNavigationOptions
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConf => <Ionicons
        name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
        size={23}
        color={drawerConf.tintColor}
      />
    },
    defaultNavigationOptions
  }
);

const UserNavigator = createStackNavigator(
  {
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConf => <Ionicons
        name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
        size={23}
        color={drawerConf.tintColor}
      />
    },
    defaultNavigationOptions
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    User: UserNavigator
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems {...props} />
            <Button title="Logout" color={Colors.primary} onPress={() => {
              dispatch(logout());
            }} />
          </SafeAreaView>
        </View>
      )
    }
  }
);

const AuthNavigator = createStackNavigator({
  Auth: AuthScreen
}, {
  defaultNavigationOptions
})

const MainNavigator = createSwitchNavigator(
  {
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
  }
)

export default createAppContainer(MainNavigator);
